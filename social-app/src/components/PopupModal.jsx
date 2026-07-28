import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Modal } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSocket } from "../context/SocketContext";

const PopupModal = ({ visible = false, onClose, onLogout }) => {
  const { disconnectSocket } = useSocket();

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text
            style={{
              color: COLORS.text,
              textAlign: "center",
              fontSize: moderateScale(FONT_SIZE.xl),
            }}
          >
            Logout
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: verticalScale(SPACING.sm),
            }}
          >
            <View
              style={{
                height: moderateScale(70),
                width: moderateScale(70),
                borderRadius: moderateScale(35),
                backgroundColor: "#fab5b5ca",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="logout"
                size={moderateScale(38)}
                color={COLORS.danger}
              />
            </View>
          </View>
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.lg),
              textAlign: "center",
              marginTop: verticalScale(SPACING.xs),
            }}
          >
            Are you sure you want to logout?
          </Text>
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.xs),
              textAlign: "center",
              marginTop: verticalScale(SPACING.xs),
            }}
          >
            You will need to login again to access your account.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "90%",
              marginTop: verticalScale(SPACING.md),
              gap: scale(SPACING.md),
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                height: verticalScale(45),
                width: "50%",
                borderRadius: moderateScale(RADIUS.md),
                color: COLORS.background,
                elevation: 10,
                borderWidth: 1,
                borderColor: COLORS.border,
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
                Cancle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                disconnectSocket();
                await onLogout();
              }}
              style={{
                height: verticalScale(45),
                width: "50%",
                borderRadius: moderateScale(RADIUS.md),
                backgroundColor: COLORS.danger,
                elevation: 10,
                borderWidth: 1,
                borderColor: COLORS.border,
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
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopupModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "95%",
    backgroundColor: COLORS.background,
    borderRadius: moderateScale(RADIUS.md),
    padding: moderateScale(SPACING.md),
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: verticalScale(SPACING.md),
  },
});
