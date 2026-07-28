import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { getToken } from "../storage/authStorage/getToken";
import { BASE_URL } from "../config/api";
import { useSocket } from "./SocketContext";

const AllFriendsContext = createContext();

const AllFriendsProvider = ({ children }) => {
  const [allFriends, setAllFriends] = useState([]);
  const [loadingAllFriends, setLoadingAllFriends] = useState(false);
  const { socket } = useSocket();
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  // ===============================
  // Helper Function
  // ===============================

  const updateOnlineStatus = (friends, onlineUserIds) => {
    return friends.map((friend) => ({
      ...friend,
      isOnline: onlineUserIds.includes(friend._id),
    }));
  };

  useEffect(() => {
    const handleOnlineUsers = (usersIds) => {
      console.log("🟢 Online Users :", usersIds);
      setOnlineUserIds(usersIds);

      // Update all friends
      setAllFriends((prevFriends) => updateOnlineStatus(prevFriends, usersIds));
    };

    socket.on("online-users", handleOnlineUsers);
    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

  // ====================
  // handle offline  users
  // ====================

  useEffect(() => {
    const handleOfflineUser = (userObj) => {
      console.log("offline user id", userObj?.userId);

      setAllFriends((prevFriend) =>
        prevFriend.map((friend) =>
          friend?._id === userObj?.userId
            ? {
                ...friend,
                isOnline: false,
                lastSeen: userObj?.lastSeen,
              }
            : friend,
        ),
      );
    };
    socket.on("offline-user", handleOfflineUser);

    return () => {
      socket.off("offline-user", handleOfflineUser);
    };
  }, [socket]);

  // ==================
  // get all friends
  // ====================
  const getAllFriends = async () => {
    try {
      setLoadingAllFriends(true);

      const token = await getToken("token");

      if (!token) {
        Alert.alert("Invalid token");
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/friends/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const friends = response?.data?.friends;

      setAllFriends(updateOnlineStatus(friends, onlineUserIds));
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(error.response?.data?.message || "Failed to fetch friends");
    } finally {
      setLoadingAllFriends(false);
    }
  };

  return (
    <AllFriendsContext.Provider
      value={{
        allFriends,
        setAllFriends,
        loadingAllFriends,
        getAllFriends,
      }}
    >
      {children}
    </AllFriendsContext.Provider>
  );
};

export default AllFriendsProvider;

export const useAllFriends = () => useContext(AllFriendsContext);
