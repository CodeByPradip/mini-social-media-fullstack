import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAllFriends } from "../../context/getFriendsContext";


const FriendProfile = ({ navigation, route }) => {
  const { friendId } = route.params;
  const { allFriends } = useAllFriends();
  const friendData = allFriends.find((friend) => friend?._id === friendId);
  
  console.log("current profile friend data", friendData);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-sharp"
            size={moderateScale(27)}
            color={COLORS.text}
          />
        </Pressable>
      </View>
      {/* profile card */}
      <View style={styles.profileCard}>
        <View style={styles.contentCard}>
          <View style={styles.imgWrap}>
            <Image
              resizeMode="cover"
              source={{
                uri:
                  friendData?.profileImage ??
                  "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=",
              }}
              style={styles.image}
            />
          </View>
          <View
            style={{
              marginTop: verticalScale(SPACING.sm),
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: moderateScale(FONT_SIZE.xl),
                fontWeight: "100",
                textTransform: "capitalize",
              }}
            >
              {friendData?.fullName}
            </Text>
          </View>
          {/* username or email */}
          <View>
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: moderateScale(FONT_SIZE.sm),
                fontWeight: "100",
              }}
            >
              {friendData?.email}
            </Text>
          </View>
          {/* online */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(SPACING.xs),
              marginVertical: verticalScale(SPACING.xs),
            }}
          >
            <View
              style={{
                height: moderateScale(16),
                width: moderateScale(16),
                borderRadius: moderateScale(15),
                backgroundColor: COLORS.black,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {friendData?.isOnline ? (
                <View
                  style={{
                    height: "75%",
                    width: "75%",
                    borderRadius: moderateScale(50),
                    backgroundColor: COLORS.online,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: "75%",
                    width: "75%",
                    borderRadius: moderateScale(50),
                    backgroundColor: COLORS.offline,
                  }}
                />
              )}
            </View>
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: moderateScale(FONT_SIZE.md),
                fontWeight: "100",
                textTransform: "capitalize",
              }}
            >
              {friendData?.isOnline ? "online" : "offline"}
            </Text>
          </View>
          {/* friend bio */}
          <View>
            <Text
              style={{
                color: COLORS.textSecondary,
                textAlign: "center",
                fontSize: moderateScale(FONT_SIZE.sm),
                fontWeight: "200",
              }}
            >
              {friendData?.bio}
            </Text>
          </View>
          {/* friends posts photos card */}
          <View
            style={{
              width: "100%",
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: verticalScale(SPACING.sm),
              borderWidth: 1,
              padding: moderateScale(5),
              borderColor: COLORS.border,
              paddingHorizontal: scale(10),
              borderRadius: moderateScale(RADIUS.md),
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: moderateScale(FONT_SIZE.md),
                }}
              >
                {friendData?.friendsCount}
              </Text>
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.xs),
                  textAlign: "center",
                }}
              >
                Friends
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: moderateScale(FONT_SIZE.md),
                  textAlign: "center",
                }}
              >
                {friendData?.postCount}
              </Text>
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.xs),
                  textAlign: "center",
                }}
              >
                Posts
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: moderateScale(FONT_SIZE.md),
                }}
              >
                2.1k
              </Text>
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.xs),
                  textAlign: "center",
                }}
              >
                Photos
              </Text>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: scale(SPACING.md),
              marginTop: verticalScale(SPACING.md),
            }}
          >
            <TouchableOpacity
            disabled
              style={[styles.btn, { backgroundColor: COLORS.primary }]}
            >
              <AntDesign
                name="user-add"
                size={moderateScale(19)}
                color={COLORS.text}
              />
              <Text style={styles.btnText}>Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("MessageScreen",{
                friendId:friendData?._id
              })}
              style={[
                styles.btn,
                {
                  backgroundColor: COLORS.inputBg,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                },
              ]}
            >
              <Ionicons
                name="chatbubble-outline"
                size={moderateScale(21)}
                color={COLORS.text}
              />
              <Text style={styles.btnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FriendProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileCard: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  contentCard: {
    alignItems: "center",
  },
  imgWrap: {
    height: moderateScale(120),
    width: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: 3,
    borderColor: COLORS.text,
    borderCurve: "continuous",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(60),
    borderCurve: "continuous",
  },
  btn: {
    flex: 2,
    height: verticalScale(40),
    paddingHorizontal: scale(10),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(RADIUS.md),
    flexDirection: "row",
    alignSelf: "center",
    gap: scale(SPACING.sm),
  },
  btnText: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.md),
    fontWeight: "200",
  },
});
