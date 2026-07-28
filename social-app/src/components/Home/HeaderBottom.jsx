import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { circleFriends } from "../../friends/friends_story_data";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { COLORS, FONT_SIZE, SPACING } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/authContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useProfileImage } from "../../context/ProfileImageContext";

const HeaderBottom = () => {
  const { user } = useAuth();
  const { getActiveImage } = useProfileImage();


  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity>
        <LinearGradient
          colors={["#FF6A00", "#EE0979", "#8E2DE2"]}
          style={{
            width: moderateScale(74),
            height: moderateScale(74),
            borderRadius: moderateScale(37),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={styles.circleImg}
            source={{ uri: item.image }}
            resizeMode="cover"
          />
        </LinearGradient>

        <Text
          style={{
            textAlign: "center",
            color: COLORS.text,
            fontSize: moderateScale(FONT_SIZE.sm),
            marginTop: verticalScale(SPACING.sm),
          }}
        >
          {item.username}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.bottomHeader}>
      <FlatList
        data={circleFriends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: scale(SPACING.md),
          gap: scale(SPACING.sm),
        }}
        ListHeaderComponent={
          <TouchableOpacity style={{}}>
            <LinearGradient
              colors={["#FF6A00", "#EE0979", "#8E2DE2"]}
              style={{
                width: moderateScale(74),
                height: moderateScale(74),
                borderRadius: moderateScale(37),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  zIndex: 2,
                  right: -0,
                  bottom: 0,
                  backgroundColor: COLORS.primary,
                  height: verticalScale(20),
                  width: scale(20),
                  borderRadius: moderateScale(999),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome6
                  name="add"
                  size={moderateScale(18)}
                  color={COLORS.text}
                />
              </View>
              <Image
                style={styles.circleImg}
                source={{
                  uri:
                    getActiveImage() ??
                    "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg",
                }}
                resizeMode="cover"
              />
            </LinearGradient>

            <Text
              style={{
                textAlign: "center",
                color: COLORS.text,
                fontSize: moderateScale(FONT_SIZE.sm),
                marginTop: verticalScale(SPACING.sm),
              }}
            >
              {"Your Story"}
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default HeaderBottom;

const styles = StyleSheet.create({
  // header bottom
  bottomHeader: {
    height: verticalScale(100),
    marginTop: verticalScale(SPACING.md),
  },
  circleImg: {
    width: moderateScale(68),
    height: moderateScale(68),
    borderRadius: moderateScale(34),
    borderWidth: 2,
    borderColor: COLORS.border,
  },
});
