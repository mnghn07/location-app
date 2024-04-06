import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Header,
  Container,
  LocationList,
  Text,
  TouchableOpacity,
  Icon
} from "@/components";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "@/Navigators";
import * as Location from "expo-location";
import { requestPermissions } from "@/utils/locations";
import MapView, { Marker } from "react-native-maps";
import { useAppStore, useLocationStore, useTimerStore } from "@/stores/client";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { BACKGROUND_FETCH_TASK, HEIGHT } from "@/utils/constants";
import { schedulePushNotification } from "@/utils/notifications";
import { AppState } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 10, // 10 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

type HomeScreenProps = NativeStackScreenProps<RootStackParamsList, "Home">;

const HomeScreen: React.FC<HomeScreenProps> = props => {
  const mapRef = React.useRef<MapView>(null);
  const appState = React.useRef(AppState.currentState);
  const mapHeight = useSharedValue(0);
  const { navigation } = props;
  const { locations, locationId, setLocationId, addLocation } =
    useLocationStore();
  const { mode, locationFrequency, locationSharing, setLocationSharing } =
    useAppStore();
  const { duration, startTimer, stopTimer } = useTimerStore();

  const [showMap, setShowMap] = useState(false);

  const onGetPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let current = await Location.getCurrentPositionAsync({});
    console.log("current", current);
    if (!!current) {
      // check duplicate
      const isDuplicate = locations.filter(
        location =>
          location.latitude === current.coords.latitude &&
          location.longitude === current.coords.longitude
      );
      if (isDuplicate.length > 0) {
        startTimer();
      }

      addLocation({
        id: current.timestamp.toString(),
        timestamp: current.timestamp,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude
      });
    }
  };

  const checkPosition = async () => {
    if (locationSharing) {
      await registerBackgroundFetchAsync();
      let interval = setInterval(() => {
        console.log("Getting location...");
        onGetPosition();
      }, locationFrequency * 1000);
      // @ts-ignore
      setLocationId(interval);
      return () => {
        clearInterval(interval);
        stopTimer();
      };
    }
  };

  useEffect(() => {
    requestPermissions();
    return () => {};
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // Load the timer when the app returns to the foreground
        if (locationSharing && duration > 0) {
          startTimer();
        }
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        // Save the timer value when the app goes to the background
        if (locationSharing && duration > 0) {
          stopTimer();
        }
      }

      // Update the current app state
      appState.current = nextAppState;
    });

    // Clean up the event listener on component unmount
    return () => {
      subscription.remove();
    };
  }, []);

  const checkForLocation = async () => {
    if (!locationSharing) {
      await unregisterBackgroundFetchAsync();
      clearInterval(locationId);
      stopTimer();
    }
  };

  useEffect(() => {
    checkPosition();
    checkForLocation();
  }, [locationFrequency, locationSharing]);

  useEffect(() => {
    if (duration === 60) {
      console.log("timer finished");
      clearInterval(locationId);
      onLocationSharing();
      stopTimer();
      onPushNoti();
    }
  }, [duration]);

  const onSetting = useCallback(
    () => navigation.navigate("Setting"),
    [navigation]
  );

  const onMap = () => {
    setShowMap(!showMap);
    mapHeight.value = withSpring(showMap ? 0 : HEIGHT * 0.5, {
      stiffness: 1000,
      damping: 500,
      mass: 3
    });

    // go to map
  };

  const onLocationSharing = async () => {
    // set location sharing, if false, clear interval. if true, set interval
    setLocationSharing();
  };

  const onGoToRegion = (location: any) => {
    if (!showMap) {
      onMap();
    }
    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      1000
    );
  };

  const onResetMap = () => {
    mapRef.current?.animateToRegion(
      {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      1000
    );
  };

  const stopLocation = (
    <TouchableOpacity
      p="s"
      borderRadius={"xl"}
      position={"absolute"}
      borderWidth={0.5}
      borderColor={"border"}
      backgroundColor={
        mode === "dark" ? "secondaryBackground" : "primaryBackground"
      }
      bottom={24}
      right={24}
      justifyContent={"center"}
      alignItems={"center"}
      onPress={onLocationSharing}
    >
      {locationSharing ? (
        <Box
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Icon name="pause-sharp" />
          <Text variant={"highlight"} ml={"s"}>
            Stop sharing
          </Text>
        </Box>
      ) : (
        <Box
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Icon name="play-sharp" />
          <Text>Start sharing</Text>
        </Box>
      )}
    </TouchableOpacity>
  );

  const onPushNoti = async () => {
    await schedulePushNotification();
  };

  const headerLeft = (
    <TouchableOpacity onPress={onMap}>
      <Icon name="map-sharp" />
    </TouchableOpacity>
  );

  const headerRight = (
    <TouchableOpacity onPress={onSetting}>
      <Icon name="settings-sharp" />
    </TouchableOpacity>
  );

  const header = (
    <Header title="Home" headerLeft={headerLeft} headerRight={headerRight} />
  );

  const map = (
    <Animated.View style={{ width: "100%", height: mapHeight }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        zoomEnabled={showMap}
        loadingEnabled
        showsUserLocation
        followsUserLocation
        initialCamera={{
          center: {
            latitude: 37.78825,
            longitude: -122.4324
          },
          pitch: 0,
          heading: 0,
          altitude: 0,
          zoom: 20
        }}
        showsMyLocationButton
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude
            }}
            onPress={() => onGoToRegion(location)}
          >
            <Icon name="location-sharp" size={32} />
          </Marker>
        ))}
        <TouchableOpacity
          width={36}
          height={36}
          borderRadius={"xl"}
          position={"absolute"}
          backgroundColor={
            mode === "dark" ? "secondaryBackground" : "primaryBackground"
          }
          bottom={10}
          right={10}
          justifyContent={"center"}
          alignItems={"center"}
          onPress={onResetMap}
        >
          <Icon name="locate-outline" />
        </TouchableOpacity>
      </MapView>
    </Animated.View>
  );

  return (
    <Container>
      {header}
      {map}
      <Box flex={1} width={"100%"} mt={"m"} mb="l">
        <LocationList locations={locations} onShowMap={onGoToRegion} />
      </Box>
      {stopLocation}
    </Container>
  );
};

export default HomeScreen;
