import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import UserAvatar from "../UserAvatar";
import { useProfileImage } from "../../context/ProfileImageContext";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ThirdHeader = ({ onPress }) => {
  const { getActiveImage } = useProfileImage();

  return (
    <View style={styles.container}>
      <UserAvatar
        image={
          getActiveImage() ??
          "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg"
        }
        isOnline
        dotSize={16}
      />

      <TouchableOpacity
      activeOpacity={0.8}
        onPress={onPress}
        style={styles.inputCard}
      >
        <Text style={styles.input}>What's on your mind</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThirdHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(SPACING.xs),
    gap: scale(SPACING.sm),
    width: "100%",
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    height: verticalScale(45),
    borderRadius: moderateScale(RADIUS.lg),
    borderCurve: "continuous",
    flex: 1,
    borderWidth: 0.4,
    borderColor: COLORS.text,
    justifyContent: "center",
  },
  input: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.md),
    paddingHorizontal: scale(SPACING.sm),
    fontWeight: "200",
    letterSpacing: 1,
  },
});
