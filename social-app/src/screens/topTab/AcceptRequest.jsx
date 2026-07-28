import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useAllUsers } from "../../context/usersContext";
import { getToken } from "../../storage/authStorage/getToken";
import axios from "axios";
import { BASE_URL } from "../../config/api";
import { useAllFriends } from "../../context/getFriendsContext";

const AcceptRequest = () => {
  const { getAllFriends } = useAllFriends();
  const { getAllUsers, allUsers } = useAllUsers();
  const friendRequestedUsers = allUsers.filter(
    (user) =>
      user.relationship.friendRequestReceived &&
      !user.relationship.isFriend &&
      !user.relationship.friendRequestSent,
  );

  const handleRequestReceived = async (item) => {
    try {
      const token = await getToken("token");

      if (!token) {
        return Alert.alert("Invalid token");
      }

      await axios.patch(
        `${BASE_URL}/api/friends/request/${item.relationship.friendRequestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await Promise.all([getAllFriends(), getAllUsers()]);
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(error?.response?.data?.message);
    }
  };

  const handleRequestReject = async (item) => {
    try {
      const token = await getToken("token");
      if (!token) {
        return Alert.alert("invalid token");
      }
      const response = await axios.delete(
        `${BASE_URL}/api/friends/request/${item?.relationship?.friendRequestId}/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await Promise.all([getAllFriends(), getAllUsers()]);
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(error?.response?.data?.message);
    }
  };

  const renderRequestSendMeUsers = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          marginTop: verticalScale(SPACING.xxl),
          width: "90%",
          alignSelf: "center",
        }}
        key={item._id}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(SPACING.md),
          }}
        >
          <View style={styles.userImageWrape}>
            <Image
              resizeMode="cover"
              style={styles.userImage}
              source={{
                uri:
                  item.profileImage ??
                  "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg",
              }}
            />
          </View>
          <View>
            <Text style={styles.userName}>{item.fullName}</Text>
            {item.relationship.mutualFriendsCount > 0 ? (
              <Text style={styles.mutualFriend}>
                {item.relationship.mutualFriendsCount} mutual friends
              </Text>
            ) : (
              <Text style={styles.mutualFriend}>{item.username}</Text>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: scale(SPACING.md),
                marginTop: verticalScale(SPACING.xs),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  handleRequestReceived(item);
                }}
                style={[styles.button, { backgroundColor: COLORS.primary }]}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleRequestReject(item);
                }}
                style={[styles.button, { backgroundColor: COLORS.inputBg }]}
              >
                <Text style={styles.btnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.acceptScreen}>
      <FlatList
        data={friendRequestedUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderRequestSendMeUsers}
        ListEmptyComponent={
          <>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: verticalScale(SPACING.large),
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.xl),
                  fontWeight: "500",
                }}
              >
                No Friend Requests yet
              </Text>
            </View>
          </>
        }
      />
    </View>
  );
};

export default AcceptRequest;

const styles = StyleSheet.create({
  acceptScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
  },
  userImageWrape: {
    height: moderateScale(70),
    width: moderateScale(70),
    borderRadius: moderateScale(35),
    overflow: "hidden",
  },
  userImage: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(25),
  },
  userName: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.sm),
    fontWeight: "600",
  },
  mutualFriend: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.sx),
  },
  button: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(SPACING.xxxl),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(RADIUS.sm),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnText: {
    color: COLORS.text,
    textAlign: "center",
    fontSize: moderateScale(FONT_SIZE.sm),
  },
});
