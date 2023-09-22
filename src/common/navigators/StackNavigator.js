import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../../Login-page/LoginPage.js";
import RegisterScreen from "../../Login-page/RegisterPage.js";
import BottomTabNavigator from "./BottomTabNavigator.js";
import Education from "../../Education.js";
import StockOverview from "../../overview-page/StockOverview.js";
import Bookmark from "../../BookmarkPage.js";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Hide the header for this screen
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeStack"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Education"
        component={Education}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StockOverview"
        component={StockOverview}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookmarkPage"
        component={Bookmark}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
