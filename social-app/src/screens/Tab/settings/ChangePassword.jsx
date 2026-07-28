import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "../../../context/authContext";

const ChangePassword = ({ navigation }) => {
  const { updatePassword } = useAuth();
  // ==================
  // STATES
  // ==================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfrimNewPassword] = useState("");

  const [currentPassValide, setCurrentPasswordValid] = useState(false);
  const [isPasswordStrong, setPasswordStrong] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [isPasswordMatch, setPasswordMatch] = useState(false);

  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // ======================================
  // Handle Passwords Inputs
  // ======================================

  // current password
  const handleCurrentPassword = (text) => {
    setCurrentPassword(text);
    setCurrentPasswordValid(text.trim().length > 0);
  };

  // new password
  const handleNewPassword = (text) => {
    setNewPassword(text);

    const hasMinLength = text.length >= 6;
    const hasUppercase = /[A-Z]/.test(text);
    const hasNumber = /[0-9]/.test(text);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(text);

    setHasMinLength(hasMinLength);
    setHasUppercase(hasUppercase);
    setHasNumber(hasNumber);
    setHasSpecialChar(hasSpecialChar);

    const valid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;

    setPasswordStrong(valid);
  };
  // confirm password
  const handlePasswordMatch = (text) => {
    setConfrimNewPassword(text);
    setPasswordMatch(newPassword === text);
  };

  // =======================================
  // handle Change Password
  // =======================================
  const isFormValid =
    currentPassValide &&
    isPasswordStrong &&
    hasMinLength &&
    hasUppercase &&
    hasNumber &&
    hasSpecialChar &&
    isPasswordMatch;

  const handleChangePassword = async () => {
    if (!isFormValid) {
      Alert.alert("Enter a valid password ");
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    console.log("result",result);
    
    if (!result) {
      return;
    }

    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-sharp"
            size={moderateScale(28)}
            color={COLORS.text}
          />
        </Pressable>
        <Text
          style={{
            color: COLORS.text,
            fontSize: moderateScale(FONT_SIZE.xl),
          }}
        >
          Change Password
        </Text>
        <View></View>
      </View>
      <View style={styles.box}>
        <View style={styles.inputBox}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.md),
              letterSpacing: 0,
            }}
          >
            Enter Current Password
          </Text>
          <View style={styles.inputWraper}>
            <MaterialIcons
              name="lock-outline"
              size={moderateScale(26)}
              color={COLORS.primary}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={handleCurrentPassword}
              // secureTextEntry
            />
          </View>
        </View>
        <View style={styles.inputBox}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.md),
              letterSpacing: 0,
            }}
          >
            Enter Password
          </Text>
          <View style={styles.inputWraper}>
            <MaterialIcons
              name="lock-outline"
              size={moderateScale(26)}
              color={COLORS.primary}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={handleNewPassword}
              secureTextEntry
            />
          </View>
        </View>
        <View style={styles.inputBox}>
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.md),
              letterSpacing: 0,
            }}
          >
            
            Confirm Password
          </Text>
          <View style={styles.inputWraper}>
            <MaterialIcons
              name="lock-outline"
              size={moderateScale(26)}
              color={COLORS.primary}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={COLORS.textSecondary}
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChangeText={handlePasswordMatch}
              secureTextEntry
            />
          </View>
        </View>
        {/*rule password details */}
        <View
          style={{
            marginTop: verticalScale(SPACING.md),
            gap: scale(SPACING.sm),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(SPACING.xs),
            }}
          >
            {currentPassValide ? (
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(24)}
                color={COLORS.success}
              />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={moderateScale(24)}
                color={COLORS.textSecondary}
              />
            )}
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONT_SIZE.md,
              }}
            >
              Curent password reqired
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(SPACING.xs),
            }}
          >
            {hasMinLength ? (
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(24)}
                color={COLORS.success}
              />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={moderateScale(24)}
                color={COLORS.textSecondary}
              />
            )}
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONT_SIZE.md,
              }}
            >
              At Least 6 characters
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(SPACING.xs),
            }}
          >
            {isPasswordStrong ? (
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(24)}
                color={COLORS.success}
              />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={moderateScale(24)}
                color={COLORS.textSecondary}
              />
            )}
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONT_SIZE.md,
              }}
            >
              Contains numbers or spical characters
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(SPACING.xs),
            }}
          >
            {isPasswordMatch ? (
              <Ionicons
                name="checkmark-circle"
                size={moderateScale(24)}
                color={COLORS.success}
              />
            ) : (
              <MaterialIcons
                name="radio-button-unchecked"
                size={moderateScale(24)}
                color={COLORS.textSecondary}
              />
            )}
            <Text
              style={{
                color: COLORS.text,
                fontSize: FONT_SIZE.md,
              }}
            >
              Password Match
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={!isFormValid}
          style={styles.button}
        >
          <Text style={styles.btnText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  box: {
    width: "90%",
    alignSelf: "center",
    marginTop: verticalScale(SPACING.large),
  },
  inputBox: {
    gap: scale(SPACING.sm),
    marginTop: verticalScale(SPACING.md),
  },
  inputWraper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    height: verticalScale(45),
    paddingHorizontal: scale(SPACING.md),
    gap: scale(SPACING.xs),
    borderRadius: moderateScale(RADIUS.md),
    borderCurve: "circular",
    backgroundColor: COLORS.inputBg,
  },
  input: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.md),
    flex: 1,
  },
  button: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(RADIUS.md),
    backgroundColor: COLORS.success,
    marginTop: verticalScale(SPACING.xl),
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
  },
});
