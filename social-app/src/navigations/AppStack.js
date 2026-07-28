import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import EditProfile from "../screens/Tab/settings/EditProfile";
import ChangePassword from "../screens/Tab/settings/ChangePassword";
import ProfileImage from "../screens/Tab/settings/ProfileImage";
import { COLORS } from "../constants/colors";
import FriendProfile from "../screens/friendProfile/FriendProfile";
import MessageScreen from "../screens/friendProfile/MessageScreen";
import PostCreate from "../screens/stack/home/PostCreate";
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.background,
        },
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ProfileImage" component={ProfileImage} />
      <Stack.Screen name="FriendProfile" component={FriendProfile} />
      <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="PostCreate" component={PostCreate} />
    </Stack.Navigator>
  );
}
