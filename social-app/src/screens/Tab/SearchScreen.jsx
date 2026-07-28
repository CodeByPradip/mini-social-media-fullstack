import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import * as Animatable from "react-native-animatable";
import { useAllUsers } from "../../context/usersContext";
import axios from "axios";
import { getToken } from "../../storage/authStorage/getToken";
import { BASE_URL } from "../../config/api";

const SearchScreen = () => {
  const { getAllUsers } = useAllUsers();
  const [search, setSearch] = useState("");
  const searching = search.length > 0;

  const { allUsers, loadingLoadUsers } = useAllUsers();

  useEffect(() => {
    getAllUsers();
  }, []);
  // ================================
  // mutal friends and other peoples
  // ================================
  const mutalFriends = allUsers.filter(
    (user) =>
      user.relationship.mutualFriendsCount > 0 &&
      !user.relationship.isFriend &&
      !user.relationship.friendRequestReceived,
  );
  const otherPeople = allUsers.filter(
    (user) =>
      !user?.relationship?.mutualFriendsCount &&
      !user?.relationship?.isFriend &&
      !user?.relationship?.friendRequestReceived,
  );

  // finel data
  const finelData = useMemo(() => {
    let data = [];

    if (mutalFriends.length > 0) {
      data.push({
        type: "heading",
        title: "People You May Know",
      });

      data.push(...mutalFriends);
    }

    if (otherPeople.length > 0) {
      data.push({ type: "heading", title: "All People" });
      data.push(...otherPeople);
    }

    return data;
  }, [mutalFriends, otherPeople]);

  // ======================
  //  handle  filter search
  // ======================
  const filteredSearchUsers = allUsers.filter((user) => {
    if (user.relationship.friendRequestReceived) {
      return;
    }
    const query = search.toLowerCase();
    const result =
      user.username.toLowerCase().includes(query) ||
      user.fullName.toLowerCase().includes(query);
    return result;
  });

  // ==========================
  //  handle Request Add Friend
  // ==========================
  const handleRequestAddFriend = async (item) => {
    try {
      const token = await getToken("token");
      if (!token) {
        return Alert.alert("invalid token");
      }
      const response = await axios.post(
        `${BASE_URL}/api/friends/request`,
        {
          username: item.username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await getAllUsers();
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(error?.response?.data?.message);
    }
  };
  // ======================
  // handle Request Cancle
  // ======================
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
      console.log(response?.data?.message);
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert(error?.response?.data?.message);
    }
  };

  //  render finel data
  const renderFinelData = ({ item, index }) => {
    if (item.type === "heading") {
      return (
        <Animatable.View
          animation={"fadeInUp"}
          duration={500}
          delay={index * 200}
          useNativeDriver={true}
          style={{
            marginTop: verticalScale(SPACING.xl),
            width: "90%",
            paddingLeft: scale(SPACING.lg),
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.md),
            }}
          >
            {item.title}
          </Text>
        </Animatable.View>
      );
    }

    return (
      <Animatable.View
        animation={"fadeInUp"}
        direction={300}
        delay={index * 150}
        useNativeDriver={true}
        style={styles.card}
      >
        <View style={styles.left}>
          <View>
            <Image
              resizeMode="cover"
              style={styles.profileImage}
              source={{
                uri:
                  item.profileImage ??
                  "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg",
              }}
            />
          </View>
          <View>
            <Text style={styles.fullName}>{item?.fullName}</Text>
            {item.relationship.mutualFriendsCount > 0 ? (
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.sm),
                }}
              >
                {item.relationship.mutualFriendsCount} mutual friends
              </Text>
            ) : (
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.sm),
                }}
              >
                {item.email}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: scale(SPACING.sm),
          }}
        >
          {item?.relationship?.friendRequestSent ? (
            <TouchableOpacity
              onPress={() => {
                handleRequestCancle(item);
              }}
              activeOpacity={0.8}
              style={[
                styles.addBtn,
                {
                  backgroundColor: item.relationship.friendRequestSent
                    ? COLORS.inputBg
                    : COLORS.primary,
                },
              ]}
            >
              <Text style={styles.addBtnText}>Cancle Request</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                handleRequestAddFriend(item);
              }}
              disabled={
                !item.relationship.friendRequestSent &&
                item?.relationship?.isFriend
              }
              activeOpacity={0.8}
              style={[
                styles.addBtn,
                {
                  backgroundColor:
                    !item.relationship.friendRequestSent &&
                    item?.relationship?.isFriend
                      ? COLORS.inputBg
                      : COLORS.primary,
                },
              ]}
            >
              <Text style={styles.addBtnText}>
                {item?.relationship?.isFriend ? "Friends" : "Add friend"}
              </Text>
            </TouchableOpacity>
          )}

          {!item.relationship?.friendRequestSent &&
            !item?.relationship?.isFriend && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.addBtn,
                  {
                    backgroundColor: COLORS.danger,
                  },
                ]}
              >
                <Text style={styles.addBtnText}>Remove</Text>
              </TouchableOpacity>
            )}
        </View>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={searching ? filteredSearchUsers : finelData}
        renderItem={renderFinelData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(SPACING.large),
        }}
        ListHeaderComponent={
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  marginBottom: verticalScale(SPACING.md),
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.xxl),
                  }}
                >
                  Search People{" "}
                </Text>
              </View>
              <View
                style={{
                  height: verticalScale(45),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                  paddingHorizontal: scale(SPACING.md),
                  backgroundColor: COLORS.inputBg,
                  borderRadius: moderateScale(RADIUS.lg),
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  overflow: "hidden",
                  paddingRight: scale(SPACING.large),
                }}
              >
                <FontAwesome6
                  name="magnifying-glass"
                  size={moderateScale(24)}
                  color={COLORS.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search people..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={search}
                  onChangeText={(text) => {
                    setSearch(text);
                  }}
                />
                {searching ? (
                  <Pressable
                    onPress={() => setSearch("")}
                    style={{
                      height: moderateScale(45),
                      width: moderateScale(45),
                      borderRadius: moderateScale(23),
                      backgroundColor: COLORS.border,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: 5,
                    }}
                  >
                    <Fontisto
                      name="close-a"
                      size={moderateScale(14)}
                      color={COLORS.textSecondary}
                    />
                  </Pressable>
                ) : null}
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  input: {
    fontSize: moderateScale(FONT_SIZE.md),
    fontWeight: "400",
    color: COLORS.textSecondary,
    flex: 1,
  },
  card: {
    marginTop: verticalScale(SPACING.md),
    width: "90%",
    gap: scale(SPACING.md),
    alignSelf: "center",
  },
  profileImage: {
    height: moderateScale(75),
    width: moderateScale(75),
    borderRadius: moderateScale(35),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(SPACING.sm),
  },
  fullName: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.md),
    textTransform: "capitalize",
  },
  addBtn: {
    flex: 2,
    paddingVertical: verticalScale(7),
    paddingHorizontal: scale(SPACING.lg),
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(RADIUS.sm),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addBtnText: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.md),
    fontWeight: "300",
  },
});
