import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  FONT_SIZE,
  GRADIENTS,
  RADIUS,
  SPACING,
} from "../../constants/colors";
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from "react-native-size-matters";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Animatable from 'react-native-animatable';





const SplashScreen = ({ onGetStarted }) => {
  return (
    <LinearGradient
      colors={GRADIENTS.splash}
      style={{
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <StatusBar style={"light"} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Animatable.View
          animation={"fadeInUp"}
          duration={500}
          delay={200}
          >
            <FontAwesome5
            name="user-shield"
            size={moderateScale(52)}
            color={COLORS.white}
          />
          </Animatable.View>
          <Animatable.Text
          animation={"fadeInUp"}
          duration={500}
          delay={400}
          style={styles.heading}>Socialize</Animatable.Text>
          <Animatable.View
          animation={"fadeInUp"}
          duration={500}
          delay={600}
          >
            <Text style={styles.subHeading}>
              {"Connect with People \n around the world"}
            </Text>
          </Animatable.View>
        </View>
        <Animatable.View
        animation={"fadeInUp"}
        duration={500}
        delay={800}
        style={styles.buttonWrapper}>
          <TouchableOpacity onPress={onGetStarted} style={styles.btn}>
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.Text animation={"fadeInUp"} duration={500} delay={1000}
          style={{
            color: COLORS.textSecondary,
            position: "absolute",
            bottom: 10,
            width: "90%",
            height: verticalScale(40),
            paddingHorizontal: moderateScale(20),
            textAlign:"center"
          }}
        >
          Join the communinity
        </Animatable.Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
  },
  heading: {
    color: COLORS.text,
    marginTop: moderateVerticalScale(SPACING.xxl),
    fontSize: FONT_SIZE.hero,
  },
  subHeading: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "400",
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 80,
    width: "90%",
    height: verticalScale(40),
    paddingHorizontal: moderateScale(20),
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.round,
    elevation: 7,
    backgroundColor: COLORS.white,
    height: "100%",
  },
  btnText: {
    fontSize: moderateScale(FONT_SIZE.md),
    color: COLORS.black,
  },
});
