import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../constants/colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../../context/authContext";
import { useProfileImage } from "../../../context/ProfileImageContext";
import * as ImagePicker from "expo-image-picker";
import Loder from "../../../components/Loder";
import { updateProfileValidation } from "../../../utils/validation";

const EditProfile = ({ navigation }) => {
  // ==================
  // GLOBAL CONTEXT
  // ==================
  const { user } = useAuth();
  const { updateProfile, getActiveImage, loading } = useProfileImage();
  // ===================
  // LOCAL STATES
  // ===================
  const [username, setUsername] = useState(user?.username);
  const [fullName, setFullName] = useState(user?.fullName);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState(user?.phone);
  const [aboutMe, setAboutMe] = useState(user?.bio);
  const [selectedImage, setSelectedImage] = useState(null);

  // ========================================
  //  pick image from gallery and set image
  // ========================================

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return Alert.alert(
        "Permission required",
        "Permission to access the media library is required",
      );
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) return;
    setSelectedImage(result.assets[0]);
    console.log("result-select image", result.assets[0]);
  };

  // ===========================
  //  call update profile image
  //  ==========================

  const updateProfileHandler = async () => {
    if (username.length < 3 && username.length > 15) {
      return Alert.alert(
        "username must gretter the 3 and less then 15 chacretor",
      );
    }

    if (fullName.length < 3 && fullName.length > 20) {
      return Alert.alert(
        "fullName must gretter then 3 and less then 20 charector",
      );
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("bio", aboutMe);

      const err = updateProfileValidation({
        username,
        fullName,
        email,
        phone,
        bio: aboutMe,
      });

      if (err.username || err.fullName|| err.email || err.phone || err.bio) {
        Alert.alert(
          "Validation Error",
          err.username || err.fullName || err.email || err.phone || err.bio,
        );
        return;
      }

      if (selectedImage) {
        formData.append("profileImage", {
          uri: selectedImage.uri,
          name: selectedImage.fileName || "profile.jpg",
          type: selectedImage.mimeType || "image/jpeg",
        });
      }

      const result = await updateProfile(formData);
      if (!result) {
        return;
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  // ================
  // get active image
  // ================
  const activeImage =
    getActiveImage() ??
    "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {loading ? <Loder /> : null}
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
            Edit Profile
          </Text>
          <TouchableOpacity onPress={updateProfileHandler} activeOpacity={0.7}>
            <Text
              style={{
                color: COLORS.primary,
                fontSize: moderateScale(FONT_SIZE.md),
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.imageWrapper}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{ uri: selectedImage?.uri ?? activeImage }}
            />
          </View>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.5}
            style={{
              backgroundColor: COLORS.primary,
              height: moderateScale(40),
              width: moderateScale(40),
              borderRadius: moderateScale(20),
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: scale(125),
              top: verticalScale(78),
            }}
          >
            <MaterialCommunityIcons
              name="image-edit-outline"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <View style={styles.inputBox}>
            <Text
              style={{
                color: COLORS.text,
                fontSize: moderateScale(FONT_SIZE.md),
                letterSpacing: 0,
              }}
            >
              Username
            </Text>
            <View style={styles.inputWraper}>
              <FontAwesome6
                name="user"
                size={moderateScale(26)}
                color={COLORS.primary}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor={COLORS.textSecondary}
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
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
              Full-Name
            </Text>
            <View style={styles.inputWraper}>
              <FontAwesome6
                name="user"
                size={moderateScale(26)}
                color={COLORS.primary}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor={COLORS.textSecondary}
                placeholder="Enter your fullName"
                value={fullName}
                onChangeText={setFullName}
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
              Email
            </Text>
            <View style={styles.inputWraper}>
              <MaterialCommunityIcons
                name="email-outline"
                size={moderateScale(26)}
                color={COLORS.primary}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor={COLORS.textSecondary}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType={"email-address"}
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
              Phone
            </Text>
            <View style={styles.inputWraper}>
              <Ionicons
                name="call-outline"
                size={moderateScale(26)}
                color={COLORS.primary}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor={COLORS.textSecondary}
                placeholder="Enter your phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType={"number-pad"}
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
              About Me
            </Text>
            <View style={styles.aboutMEBox}>
              <TextInput
                multiline
                numberOfLines={6}
                style={styles.aboutMeInput}
                placeholderTextColor={COLORS.textSecondary}
                placeholder="Enter your phone"
                value={aboutMe}
                onChangeText={setAboutMe}
              />

              <Text
                style={{
                  color: COLORS.textSecondary,
                  position: "absolute",
                  bottom: verticalScale(5),
                  right: scale(10),
                }}
              >
                {`${aboutMe?.length || 0}/150`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

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
  body: {
    alignItems: "center",
    justifyContent: "center",
    height: verticalScale(130),
  },
  imageWrapper: {
    height: moderateScale(120),
    width: moderateScale(120),
    borderRadius: moderateScale(60),
    backgroundColor: COLORS.primary,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "90%",
    width: "90%",
    borderRadius: moderateScale(60),
  },
  footer: {
    width: "90%",
    alignSelf: "center",
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
  aboutMEBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: scale(SPACING.md),
    borderRadius: moderateScale(RADIUS.md),
    borderCurve: "circular",
    backgroundColor: COLORS.inputBg,
    height: verticalScale(100),
  },
  aboutMeInput: {
    height: "100%",
    width: "100%",
    textAlignVertical: "top",
    fontSize: moderateScale(FONT_SIZE.md),
    color: COLORS.textSecondary,
  },
});
