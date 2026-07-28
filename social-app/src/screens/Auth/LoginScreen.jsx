import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  FONT_SIZE,
  GRADIENTS,
  RADIUS,
  SHADOW,
  SPACING,
} from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { verticalScale } from "react-native-size-matters";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { loginValidation } from "../../utils/validation";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../../context/authContext";
import { useSocket } from "../../context/SocketContext";

const AnimatableButton = Animatable.createAnimatableComponent(TouchableOpacity);

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passErr, setPassErr] = useState("");
  const [usernameOrEmailErr, setUsernameOrEmailErr] = useState("");

  const { loginUser, loading } = useAuth();
  const { initializeSocket } = useSocket();

  const handleLoginUser = async () => {
    const errors = loginValidation(usernameOrEmail, password);

    setUsernameOrEmailErr(errors.usernameOrEmail);
    setPassErr(errors.password);

    // stop if any error exists
    if (errors.usernameOrEmail || errors.password) {
      return;
    }

    const res = await loginUser(usernameOrEmail, password);
    

    if (res?.data?.success) {
      initializeSocket(res.data.user._id);
    }
  };
  return (
    <LinearGradient colors={GRADIENTS.login} style={{ flex: 1 }}>
      <StatusBar style={"light"} />
      <SafeAreaView style={{ flex: 1 }}>
        <Animatable.View
          animation={"fadeInDown"}
          useNativeDriver={true}
          duration={500}
          delay={150}
          style={styles.header}
        >
          <Text style={styles.heading}>Wellcome Back👋</Text>
          <Text style={styles.subHeading}>Login to continue</Text>
        </Animatable.View>

        <View style={styles.form}>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={500}
            delay={250}
          >
            <CustomInput
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              title="Username or Email"
              placeholder="Enter your email"
              keyboardType={"email-address"}
              error={usernameOrEmailErr}
            />
          </Animatable.View>
          <Animatable.View
            animation={"fadeInUp"}
            useNativeDriver={true}
            duration={500}
            delay={350}
          >
            <CustomInput
              value={password}
              onChangeText={setPassword}
              // secureTextEntry
              title="Password"
              placeholder="Enter your password"
              error={passErr}
            />
          </Animatable.View>
          <AnimatableButton
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={500}
            delay={450}
          >
            <Text style={styles.forgetPassword}>Forgot Password?</Text>
          </AnimatableButton>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={500}
            delay={550}
          >
            {loading ? (
              <CustomButton onPress={handleLoginUser} title={"Loding..."} />
            ) : (
              <CustomButton onPress={handleLoginUser} title={"Login"} />
            )}
          </Animatable.View>
        </View>
        <AnimatableButton
          animation={"fadeInUp"}
          duration={500}
          delay={650}
          useNativeDriver={true}
          onPress={() => navigation.navigate("Signup")}
          style={{
            marginTop: verticalScale(SPACING.screenVertical),
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: FONT_SIZE.lg, color: COLORS.text }}>
            Don't have an account?{" "}
            <Text style={{ color: COLORS.primary }}>Sign Up</Text>{" "}
          </Text>
        </AnimatableButton>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  header: {
    width: "90%",
    alignSelf: "center",
    marginVertical: verticalScale(SPACING.screenVertical),
  },
  heading: {
    color: COLORS.text,
    fontWeight: "500",
    fontSize: FONT_SIZE.xxl,
  },
  subHeading: {
    fontSize: FONT_SIZE.md,
    fontWeight: "400",
    color: COLORS.text,
  },
  form: {
    marginTop: verticalScale(SPACING.xxxl),
    width: "90%",
    alignSelf: "center",
  },
  forgetPassword: {
    fontSize: FONT_SIZE.md,
    marginTop: verticalScale(SPACING.sm),
    color: COLORS.text,
    alignSelf: "flex-end",
  },
});
