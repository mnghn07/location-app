import React, { useCallback, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import Root from "@/Navigators";
import { ThemeProvider } from "@shopify/restyle";
import { useAppStore } from "@/stores/client";
import theme from "@/themes";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import * as TaskManager from "expo-task-manager";
import { LOCATION_TASK_NAME, BACKGROUND_FETCH_TASK } from "@/utils/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";

SplashScreen.preventAutoHideAsync();
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ error }) => {
  if (error) {
    console.log("Error occurred - check `error.message` for more details");
    return;
  }
  console.log("Background fetch executed");
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log("Error occurred - check `error.message` for more details.");
    return;
  }
  if (data) {
    const { locations } = data;
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function App() {
  const colorScheme = useColorScheme();
  const { mode, setMode, setPushToken, onHandleReceivedNotification } =
    useAppStore();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [loaded, error] = useFonts({
    MontserratRegular: require("assets/fonts/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("assets/fonts/Montserrat-SemiBold.ttf"),
    MontserratBold: require("assets/fonts/Montserrat-Bold.ttf"),
    MontserratItalic: require("assets/fonts/Montserrat-Italic.ttf"),
    MontserratMedium: require("assets/fonts/Montserrat-Medium.ttf"),
    MontserratLight: require("assets/fonts/Montserrat-Light.ttf")
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setPushToken(token || "");
      console.log("token", token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log("notification", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        !!onHandleReceivedNotification &&
          onHandleReceivedNotification(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (colorScheme === "dark") {
      setMode();
    }
  }, [colorScheme, setMode]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={mode === "dark" ? "light" : "dark"} />
          <Root />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
