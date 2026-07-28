import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONT_SIZE, RADIUS, SHADOW, SPACING } from "../constants/colors";
import { verticalScale } from "react-native-size-matters";

const CustomButton = ({title,onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: COLORS.primary,
    height: verticalScale(40),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    ...SHADOW.button,
    marginTop: verticalScale(SPACING.md),
  },
  btnText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
  },
});
