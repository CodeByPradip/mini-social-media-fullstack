import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Tab/HomeScreen";
import ProfileScreen from "../screens/Tab/ProfileScreen";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, FONT_SIZE, SPACING } from "../constants/colors";
import SearchScreen from "../screens/Tab/SearchScreen";
import AcceptFriendScreen from "../screens/Tab/AcceptFriendScreen";
import FriendScreen from "../screens/Tab/FriendScreen";

const Tab = createBottomTabNavigator();

// watch this video to create beautifull tab navigator
// => link https://youtu.be/Kl8-PC_z65g?si=XK2gXQ3f9IATzMmY

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: "shift",

        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 0,

          height: verticalScale(55),

          backgroundColor: COLORS.background,

          borderRadius: 22,

          borderTopWidth: 0.5,
          borderTopColor: COLORS.border,

          elevation: 15,

          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.12,
          shadowRadius: 15,
        },

        tabBarItemStyle: {
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          marginTop: verticalScale(10),
        },

        tabBarLabelStyle:{
          fontSize:moderateScale(FONT_SIZE.xs),
          marginTop:verticalScale(SPACING.xs)
        },

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#8E8E93",

        tabBarIcon: ({ focused, color }) => {
          let iconName = "";

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;

            case "Search":
              iconName = focused ? "search" : "search-outline";
              break;

            case "Friends":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Requests":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return (
            <Ionicons name={iconName} size={moderateScale(26)} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Friends" component={FriendScreen} />
      <Tab.Screen name="Requests" component={AcceptFriendScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
