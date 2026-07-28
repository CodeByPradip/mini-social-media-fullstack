import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { COLORS } from "../constants/colors";

const UserAvatar = ({
  image,
  isOnline = false,
  // Avatar Size
  size = moderateScale(45),
  // Online Dot Size
  dotSize = moderateScale(12),
}) => {
  return (
    <View
      style={[
        styles.wrapper,
        {
          height: moderateScale(size),
          width: moderateScale(size),
          borderRadius: moderateScale(size / 2),
        },
      ]}
    >
      <Image
        resizeMode="cover"
        source={{
          uri: image,
        }}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: moderateScale(size / 2),
        }}
      />

      {isOnline && (
        <View
          style={[
            styles.onlineOuter,
            {
              height: moderateScale(dotSize),
              width: moderateScale(dotSize),
              borderRadius: moderateScale(dotSize / 2),
              position: "absolute",
              zIndex: 5,
              right: -5,
              bottom: 0,
            },
          ]}
        >
          <View
            style={[
              styles.onlineInner,
              {
                borderRadius: moderateScale(dotSize / 2),
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },

  onlineOuter: {
    position: "absolute",
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  onlineInner: {
    height: "70%",
    width: "70%",
    backgroundColor: COLORS.online,
  },
});
