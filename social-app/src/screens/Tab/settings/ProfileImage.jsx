import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useAuth } from "../../../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { user } from "../../../context/authContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ProfileImage = ({ navigation }) => {
  const { user } = useAuth();
  const currentImage = user?.profileImages.find((img) => img.isActive === true);
  const activeImg =
    currentImage?.url  ??
    "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg";
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.badge}
        >
          <Ionicons
            name="arrow-back-outline"
            size={moderateScale(24)}
            color={COLORS.text}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.heading}>Profile Picture History</Text>
        </View>
        <View></View>
      </View>
      <View style={styles.subWrap}>
        <Text style={styles.sub}>All your previous profile photos</Text>
      </View>
      <FlatList
        data={[...user?.profileImages].reverse()}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.lg),
                }}
              >
                No profle images upload
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              width: "90%",
              alignSelf: "center",
              marginTop: verticalScale(SPACING.md),
              flexDirection: "row",
              alignItems: "center",
              flexShrink: 0,
              flexWrap: "wrap",
              gap: scale(SPACING.sm),
            }}
          >
            {currentImage && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  position: "absolute",
                  paddingHorizontal: scale(10),
                  paddingVertical: verticalScale(7),
                  backgroundColor: COLORS.primary,
                  zIndex: 999,
                  borderRadius: moderateScale(RADIUS.lg),
                  bottom: 10,
                  left: 150,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.sm),
                  }}
                >
                  View Image
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                width: "100%",
                height: verticalScale(297),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: moderateScale(RADIUS.md),
              }}
            >
              <Image
                resizeMode="cover"
                source={{ uri: item.url }}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: moderateScale(RADIUS.md),
                }}
              />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // header
  header: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  badge: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2e3eeb",
    elevation: 10,
  },
  heading: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.xl),
  },
  subWrap: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: verticalScale(SPACING.xs),
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.sm),
    marginLeft: scale(SPACING.xxxl),
  },
  // card box
});
