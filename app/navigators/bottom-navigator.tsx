/* eslint-disable react/display-name */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { color } from "../theme"
import { RfidScreen, CodebarScreen } from "../screens"
import { NavigatorParamList } from "./app-navigator"
// import HomeIcon from "../../assets/svgs/home-icon"
// import HeartIcon from "../../assets/svgs/heart-icon"
// import MapIcon from "../../assets/svgs/map-icon"
// import ProfileIcon from "../../assets/svgs/profile-icon"

const Tab = createBottomTabNavigator<NavigatorParamList>()
export const BottomNavigationBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="welcome"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary,
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 1,
          borderTopWidth: 0,
          shadowColor: "grey",
          shadowOpacity: 0.9,
          shadowRadius: 2,
          shadowOffset: {
            height: 1,
            width: 1,
          },
        },
      }}
    >
      <Tab.Screen
        name={"codebar"}
        component={CodebarScreen}
        options={{
          tabBarActiveTintColor: color.primary,
        }}
      />
      <Tab.Screen
        name={"rfid"}
        component={RfidScreen}
        options={{
          tabBarActiveTintColor: color.primary,
        }}
      />
    </Tab.Navigator>
  )
}