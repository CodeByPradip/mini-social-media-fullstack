import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import SplashScreen from "../screens/splash/SplashScreen";
import { useAuth } from "../context/authContext";
import { COLORS } from "../constants/colors";
import { useAllFriends } from "../context/getFriendsContext";
import { useSocket } from "../context/SocketContext";
import CommentBottomSheet from "../components/bottomSheet/CommentBottomSheet";
import { BottomSheetContextProvider } from "../context/BottomSheetContext";

export const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user } = useAuth();
  const { getAllFriends } = useAllFriends();
  const { initializeSocket } = useSocket();

  useEffect(() => {
    if (!user) return;

    initializeSocket(user._id);
    const init = async () => {
      initializeSocket(user._id);
      await getAllFriends();
    };

    init();

    // first time
  }, [user]);

  const MyTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: COLORS.background,
      card: COLORS.card,
      border: COLORS.border,
      text: COLORS.text,
      primary: COLORS.primary,
    },
  };

  if (showSplash) {
    return (
      <SplashScreen
        onGetStarted={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  return (
    <BottomSheetContextProvider>
      <NavigationContainer theme={MyTheme}>
        {user ? <AppStack /> : <AuthStack />}
        <CommentBottomSheet />
      </NavigationContainer>
    </BottomSheetContextProvider>
  );
};
