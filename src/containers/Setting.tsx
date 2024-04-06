import React, { useEffect, useState } from "react";
import { RootStackParamsList } from "@/Navigators";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Box, Container, Header, Text, TouchableOpacity } from "@/components";
import { Switch } from "react-native-gesture-handler";
import { Alert, StyleSheet, TextInput } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/themes";
import { useAppStore } from "@/stores/client";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  unregisterNotificationsAsync
} from "@/utils/notifications";

type SettingScreenProps = NativeStackScreenProps<
  RootStackParamsList,
  "Setting"
>;

const SettingScreen: React.FC<SettingScreenProps> = props => {
  const { navigation } = props;
  const {
    mode,
    setMode,
    notificationPermission,
    setNotificationPermission,
    locationFrequency,
    setFrequency,
    pushToken,
    setPushToken
  } = useAppStore();
  const theme = useTheme<Theme>();
  const [locationFreq, setLocationFreq] = useState(
    locationFrequency.toString()
  );

  useEffect(() => {
    onGetPermission();
  }, []);

  const onGetPermission = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    console.log("permission", status, pushToken);
    setNotificationPermission(status);
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
  };

  const onSetPermission = async (value: boolean) => {
    if (value) {
      setNotificationPermission(Location.PermissionStatus.GRANTED);
      registerForPushNotificationsAsync()
        .then(token => {
          console.log("token", token);
          setPushToken(token || "");
        })
        .catch(err => {
          console.log("error", err);
        });
    } else {
      console.log("Permission to access location was denied");
      setNotificationPermission(Location.PermissionStatus.DENIED);

      await unregisterNotificationsAsync();
    }
  };

  const onChangeFrequency = (text: string) => {
    if (isNaN(parseInt(text))) return;
    if (parseInt(text) < 1) {
      Alert.alert("Error", "Frequency must be greater than 0");
      return;
    }

    console.log(text);
    setLocationFreq(text);
  };

  const onSetFrequency = () => {
    setFrequency(parseInt(locationFreq));
    navigation.navigate("Home");
  };

  const header = <Header noStatusBar title={"Setting"} />;

  return (
    <Container>
      {header}
      <Box p="m">
        <Box
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
          mb={"m"}
        >
          <Text
            variant={"highlight"}
            color={mode === "dark" ? "subtitleText" : "primaryText"}
          >
            Notification permission
          </Text>
          <Switch
            value={notificationPermission === "granted" && pushToken !== ""}
            onValueChange={onSetPermission}
            trackColor={{
              true:
                mode === "dark"
                  ? theme.colors.secondarySwitch
                  : theme.colors.primarySwitch,
              false:
                mode === "dark"
                  ? theme.colors.secondaryUnswitch
                  : theme.colors.primaryUnswitch
            }}
          />
        </Box>
        <Box mb={"m"}>
          <Text
            variant={"highlight"}
            color={mode === "dark" ? "subtitleText" : "primaryText"}
          >
            Location frequency
          </Text>
          <TextInput
            style={[
              theme.textVariants.input,
              styles.input,
              {
                color:
                  mode === "dark"
                    ? theme.colors.secondaryText
                    : theme.colors.primaryText,
                backgroundColor:
                  mode === "dark"
                    ? theme.colors.secondaryBackground
                    : theme.colors.primaryBackground,
                marginBottom: theme.spacing.s
              }
            ]}
            cursorColor={
              mode === "dark"
                ? theme.colors.secondaryText
                : theme.colors.primaryText
            }
            selectionColor={
              mode === "dark"
                ? theme.colors.secondaryText
                : theme.colors.primaryText
            }
            value={locationFreq}
            onChangeText={onChangeFrequency}
          />
          <TouchableOpacity
            width={"100%"}
            height={40}
            justifyContent={"center"}
            alignItems={"center"}
            borderWidth={0.5}
            borderColor={"border"}
            borderRadius={"s"}
            onPress={onSetFrequency}
            activeOpacity={0.8}
          >
            <Text color={mode === "dark" ? "subtitleText" : "primaryText"}>
              Set Frequency
            </Text>
          </TouchableOpacity>
        </Box>
        <Box
          flexDirection={"row"}
          justifyContent="space-between"
          alignItems={"center"}
          mb={"m"}
        >
          <Text
            variant={"highlight"}
            color={mode === "dark" ? "subtitleText" : "primaryText"}
          >
            Dark mode
          </Text>
          <Switch
            value={mode === "dark"}
            onValueChange={setMode}
            trackColor={{
              true:
                mode === "dark"
                  ? theme.colors.secondarySwitch
                  : theme.colors.primarySwitch,
              false:
                mode === "dark"
                  ? theme.colors.secondaryUnswitch
                  : theme.colors.primaryUnswitch
            }}
          />
        </Box>
      </Box>
    </Container>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "50%",
    height: 50
  }
});

export default SettingScreen;
