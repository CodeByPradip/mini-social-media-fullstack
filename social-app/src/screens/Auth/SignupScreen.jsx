import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, GRADIENTS, SPACING } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { verticalScale } from "react-native-size-matters";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { signupValidation } from "../../utils/validation";
import { useAuth } from "../../context/authContext";
import { StatusBar } from "expo-status-bar";
import * as Animatable from "react-native-animatable";
import { useSocket } from "../../context/SocketContext";

const AnimatableButton = Animatable.createAnimatableComponent(TouchableOpacity);

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [usernameErr, setUsernameErr] = useState("");
  const [fullNameErr, setFullNameErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passErr, setPassErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  const { registerUser, loading, error } = useAuth();
  const {initializeSocket}=useSocket()

  const handleInput = async () => {
    // 1. mujhe validate karna hai form inputs ko
    // 2. agar sab sahi hai toh mujhe aage ke step mai badhana hai / agar error aaye toh message throw karna hai .
    // 3. ab mujhe context api se signup function ko call karanan hai. aur form data ko pass karna hai .
    const errors = signupValidation(formData);

    // show errors
    setUsernameErr(errors.username);
    setFullNameErr(errors.fullName);
    setEmailErr(errors.email);
    setPassErr(errors.password);
    setPhoneErr(errors.phone);

    console.log("password: ", formData.password);

    // stop if any error exists
    if (
      errors.username ||
      errors.email ||
      errors.fullName ||
      errors.phone ||
      errors.password
    ) {
      return;
    }

    const result = await registerUser(formData);
    if (res?.data?.success) {
      initializeSocket(res.data.user._id);
      Alert.alert("Success", "Account Created Successfully");
    }

  };

  return (
    <LinearGradient colors={GRADIENTS.signup} style={{ flex: 1 }}>
      <StatusBar style={"light"} />
      <SafeAreaView style={{ flex: 1 }}>
        <Animatable.View
          useNativeDriver={true}
          animation={"fadeInDown"}
          duration={300}
          delay={150}
          style={styles.header}
        >
          <Text style={styles.heading}>Create Account 😧</Text>
          <Text style={styles.subHeading}>Join start connecting</Text>
        </Animatable.View>

        <View style={styles.form}>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={300}
            delay={250}
          >
            <CustomInput
              value={formData.username}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  username: value,
                }))
              }
              error={usernameErr}
              title="Username"
              placeholder="Enter your username"
            />
          </Animatable.View>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={300}
            delay={350}
          >
            <CustomInput
              value={formData.fullName}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  fullName: value,
                }))
              }
              error={fullNameErr}
              title="Full-Name"
              placeholder="Enter your fullName"
            />
          </Animatable.View>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={300}
            delay={450}
          >
            <CustomInput
              title="Email"
              placeholder="Enter your Email"
              keyboardType={"email-address"}
              value={formData.email}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  email: value,
                }))
              }
              error={emailErr}
            />
          </Animatable.View>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={300}
            delay={550}
          >
            <CustomInput
              title="Phone"
              placeholder="Enter your Phone"
              value={formData.phone}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: value,
                }))
              }
              error={phoneErr}
            />
          </Animatable.View>
          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={300}
            delay={650}
          >
            <CustomInput
              secureTextEntry
              title="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  password: value,
                }))
              }
              error={passErr}
            />
          </Animatable.View>

          <Animatable.View
            useNativeDriver={true}
            animation={"fadeInUp"}
            duration={300}
            delay={750}
          >
            {loading ? (
              <CustomButton onPress={handleInput} title={"Loding..."} />
            ) : (
              <CustomButton onPress={handleInput} title={"Signup"} />
            )}
          </Animatable.View>
        </View>
        <AnimatableButton
          useNativeDriver={true}
          animation={"fadeInUp"}
          duration={300}
          delay={850}
          onPress={() => navigation.goBack()}
          style={{
            marginTop: verticalScale(SPACING.screenVertical),
            alignSelf: "center",
          }}
        >
          <Text style={{ fontSize: FONT_SIZE.lg, color: COLORS.text }}>
            Don't have an account?{" "}
            <Text style={{ color: COLORS.primary }}>Log In</Text>
          </Text>
        </AnimatableButton>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignupScreen;

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
    marginTop: verticalScale(SPACING.xxl),
    width: "90%",
    alignSelf: "center",
  },
});
