import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopTabNavigator } from "../../navigations/TopTabNavigator";
import { COLORS, FONT_SIZE, SPACING } from "../../constants/colors";
import { moderateScale, verticalScale } from "react-native-size-matters";

const AcceptFriendScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View
        animation={"fadeInUp"}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: verticalScale(SPACING.md),
        }}
      >
        <Text
          style={{ color: COLORS.text, fontSize: moderateScale(FONT_SIZE.lg) }}
        >
          Friend Requests
        </Text>
      </View>
      <TopTabNavigator />
    </SafeAreaView>
  );
};

export default AcceptFriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
