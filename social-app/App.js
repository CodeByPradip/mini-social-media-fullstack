import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContextProvider } from "./src/context/authContext";
import { ProfileImageContextProvider } from "./src/context/ProfileImageContext";
import { UsersContextProvider } from "./src/context/usersContext";
import { AppNavigator } from "./src/navigations/AppNavigator";
import AllFriendsProvider from "./src/context/getFriendsContext";
import { SocketContextProvider } from "./src/context/SocketContext";
import { PostContextProvider } from "./src/context/PostContext";
import { CommentContextProvider } from "./src/context/CommentContext";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <SocketContextProvider>
          <UsersContextProvider>
            <AllFriendsProvider>
              <PostContextProvider>
                <CommentContextProvider>
                  <ProfileImageContextProvider>
                    <AppNavigator />
                  </ProfileImageContextProvider>
                </CommentContextProvider>
              </PostContextProvider>
            </AllFriendsProvider>
          </UsersContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
