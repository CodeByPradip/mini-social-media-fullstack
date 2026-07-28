import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useAllUsers } from "../../context/usersContext";
import { getToken } from "../../storage/authStorage/getToken";
import axios from "axios";
import { BASE_URL } from "../../config/api";

const SendRequest = () => {
  const { allUsers, setAllUsers, getAllUsers } = useAllUsers();
  const sendRequests = allUsers.filter(
    (user) => user.relationship.friendRequestSent,
  );

  // Handle cancle you sent request
  const handleRequestCancle = async (item) => {
    try {
      const token = await getToken("token");
      if (!token) {
        return Alert.alert("invalid token");
      }
      const response = await axios.delete(
        `${BASE_URL}/api/friends/request/${item?.relationship?.friendRequestId}/cancle`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await getAllUsers();
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(error?.response?.data?.message || " cancle request failed");
    }
  };

  const renderRequestSendMeUsers = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        useNativeDriver={true}
        style={{
          marginTop: verticalScale(SPACING.xxl),
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              handleRequestCancle(item);
            }}
            style={[styles.button, { backgroundColor: COLORS.inputBg }]}
          >
            <Text style={styles.btnText}>Cancle</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.acceptScreen}>
      <FlatList
        data={sendRequests}
        keyExtractor={(item) => item._id}
        renderItem={renderRequestSendMeUsers}
        contentContainerStyle={{
          paddingBottom: verticalScale(55),
        }}
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
                No Send Requests yet
              </Text>
            </View>
          </>
        }
      />
    </View>
  );
};

export default SendRequest;

const styles = StyleSheet.create({
  acceptScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
  },
  userImageWrape: {
    height: moderateScale(60),
    width: moderateScale(60),
    borderRadius: moderateScale(30),
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
