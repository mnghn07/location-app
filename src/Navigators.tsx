import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { HomeScreen, SettingScreen } from "./containers";

export type RootStackParamsList = {
  Home: undefined;
  Setting: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamsList>();

const Root = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Root;
