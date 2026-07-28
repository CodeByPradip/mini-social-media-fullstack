import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { circleFriends } from "../../friends/friends_story_data";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONT_SIZE, SPACING } from "./../../constants/colors";

const HeaderTop = () => {
  return (
    <View style={styles.topHeader}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
        }}
      >
        <Pressable>
          <EvilIcons
            name="navicon"
            size={moderateScale(36)}
            color={COLORS.text}
          />
        </Pressable>
        <Pressable>
          <Text style={styles.headerTopText}>Home</Text>
        </Pressable>
      </View>
      <TouchableOpacity>
        <View style={styles.notify}>
          <Text style={styles.notifyText}>3</Text>
        </View>
        <Feather name="bell" size={moderateScale(27)} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderTop;

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  headerTopText: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.lg),
    fontWeight: "400",
  },
  notify: {
    position: "absolute",
    backgroundColor: COLORS.danger,
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(10),
    bottom: 20,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  notifyText: {
    color: COLORS.text,
    textAlign: "center",
  },
});
