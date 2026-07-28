import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import {
  COLORS,
  FONT_SIZE,
  GRADIENTS,
  RADIUS,
  SPACING,
} from "../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const CustomInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType="default",
  error
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inputBox}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text}
          keyboardType={keyboardType}
        />
      </View>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    gap: scale(SPACING.sm),
  },
  title: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  inputBox: {
    height: verticalScale(45),
    width: "100%",
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    borderCurve: "continuous",
    justifyContent: "center",
    paddingHorizontal: scale(SPACING.screenHorizontal),
    backgroundColor: COLORS.inputBg,
  },
  input: {
    fontSize: moderateScale(FONT_SIZE.md),
    color: COLORS.text,
  },
  errorText:{
    color:COLORS.danger,
    fontSize:FONT_SIZE.sm,
  }
});
