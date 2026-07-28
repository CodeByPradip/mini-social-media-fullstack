import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import AcceptRequest from "../screens/topTab/AcceptRequest";
import SendRequest from "../screens/topTab/SendRequest";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { COLORS, FONT_SIZE } from "../constants/colors";

const TopTab = createMaterialTopTabNavigator();
export const TopTabNavigator = () => {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarStyle: {
          elevation: 0,
          backgroundColor:COLORS.background
        },
        tabBarLabelStyle: {
          fontSize:moderateScale(FONT_SIZE.md),
          color: COLORS.text,
          fontWeight: "400",
          textTransform: 0,
        },
        tabBarActiveTintColor: "#ffffff",

        tabBarInactiveTintColor: "#9E9E9E",

        tabBarIndicatorStyle: {
          backgroundColor: COLORS.primary,
          height: 3,
        },

        tabBarItemStyle: {
          flex: 1,
        },

        swipeEnabled: true,
        lazy: true,
      }}
    >
      <TopTab.Screen options={{
        title:"Received"
      }}  name={"AcceptRequest"} component={AcceptRequest} />
      <TopTab.Screen  options={{
        title:"Sent"
      }} name={"SendRequest"} component={SendRequest} />
    </TopTab.Navigator>
  );
};
