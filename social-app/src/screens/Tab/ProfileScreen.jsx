import {
  View,
  StyleSheet,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useAuth } from "../../context/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useProfileImage } from "../../context/ProfileImageContext";
import * as ImagePicker from "expo-image-picker";
import Loder from "../../components/Loder";
import { useState } from "react";
import PopupModal from "../../components/PopupModal";

const ProfileScreen = ({ navigation }) => {
  const { logoutUser, user } = useAuth();
  const { getActiveImage, uploadProfileImage, imageUploadLoading } =
    useProfileImage();
  const [showModal, setShowModal] = useState(false);

  console.log("user :", user);

  // ===================
  // LOCALE STATES
  // ===================

  // ========================================
  //  pick image from gallery and update image
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

    await uploadProfileImage(result.assets[0]);
  };

  const activeImage =
    getActiveImage() ??
    "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg";

  return (
    <View style={styles.container}>
      {imageUploadLoading ? <Loder /> : null}
      <SafeAreaView style={styles.profileView}>
        <View style={styles.header}>
          <Pressable>
            <Ionicons
              name="chevron-back-sharp"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          </Pressable>
          <Text
            style={{
              fontSize: moderateScale(FONT_SIZE.md),
              fontWeight: "600",
              color: COLORS.text,
            }}
          >
            My Profile
          </Text>
          <Pressable>
            <AntDesign
              name="setting"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          </Pressable>
        </View>
        {/* profile card view */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            {/* image */}
            <View style={styles.profileImageWrap}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: activeImage,
                }}
                resizeMode="cover"
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
                top: verticalScale(65),
                zIndex: 999,
              }}
            >
              <MaterialIcons
                name="add-photo-alternate"
                size={moderateScale(28)}
                color={COLORS.text}
              />
            </TouchableOpacity>
            {/* name fullName ya email */}
            <View
              style={{
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                  width: "100%",
                  marginLeft: scale(SPACING.md),
                }}
              >
                <Text style={styles.fullName}>{user?.fullName}</Text>
                <View
                  style={{
                    backgroundColor: "white",
                    height: moderateScale(20),
                    width: moderateScale(20),
                    borderRadius: moderateScale(50),
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ position: "absolute" }}>
                    <MaterialCommunityIcons
                      name="check-decagram"
                      size={moderateScale(30)}
                      color={COLORS.primary}
                    />
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>
            {/* Bio */}
            <View>
              <Text style={styles.bio}>{user?.bio}</Text>
            </View>
            {/* row */}
            <View style={styles.userProfileInfo}>
              <View style={styles.userInfoCard}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.md),
                  }}
                >
                  {user?.stats?.postsCount}
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: moderateScale(FONT_SIZE.xs),
                  }}
                >
                  Posts
                </Text>
              </View>
              <View style={styles.userInfoCard}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.md),
                  }}
                >
                  {user?.stats?.friendsCount}
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: moderateScale(FONT_SIZE.xs),
                  }}
                >
                  Friends
                </Text>
              </View>
              <View style={styles.userInfoCard}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.md),
                  }}
                >
                  2.1k
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: moderateScale(FONT_SIZE.xs),
                  }}
                >
                  Followers
                </Text>
              </View>
              <View style={styles.userInfoCard}>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.md),
                  }}
                >
                  180
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: moderateScale(FONT_SIZE.xs),
                  }}
                >
                  Following
                </Text>
              </View>
            </View>
          </View>
          {/* ==================== */}
          {/* SETTINGS */}
          {/* ==================== */}
          <View
            style={{
              position: "absolute",
              top: 300,
              flex: 1,
              width: "90%",
              gap: scale(SPACING.md),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("EditProfile")}
              style={[
                styles.settingCard,
                { borderBottomWidth: 1, borderBottomColor: COLORS.border },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                }}
              >
                <View
                  style={{
                    height: moderateScale(45),
                    width: moderateScale(45),
                    borderRadius: moderateScale(22),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.border,
                  }}
                >
                  <FontAwesome6
                    name="user"
                    size={moderateScale(24)}
                    color={COLORS.primary}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: moderateScale(FONT_SIZE.md),
                      fontWeight: "200",
                    }}
                  >
                    Edit Profile
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    Update your persional information
                  </Text>
                </View>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={moderateScale(24)}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ChangePassword")}
              style={[
                styles.settingCard,
                { borderBottomWidth: 1, borderBottomColor: COLORS.border },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                }}
              >
                <View
                  style={{
                    height: moderateScale(45),
                    width: moderateScale(45),
                    borderRadius: moderateScale(22),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.border,
                  }}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={moderateScale(24)}
                    color={COLORS.primary}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: moderateScale(FONT_SIZE.md),
                      fontWeight: "200",
                    }}
                  >
                    Change Password
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    Update your account Password
                  </Text>
                </View>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={moderateScale(24)}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ProfileImage")}
              style={[
                styles.settingCard,
                { borderBottomWidth: 1, borderBottomColor: COLORS.border },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                }}
              >
                <View
                  style={{
                    height: moderateScale(45),
                    width: moderateScale(45),
                    borderRadius: moderateScale(22),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.border,
                  }}
                >
                  <FontAwesome5
                    name="photo-video"
                    size={moderateScale(20)}
                    color={COLORS.primary}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: moderateScale(FONT_SIZE.md),
                      fontWeight: "200",
                    }}
                  >
                    Profile Picture History
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    View all your profile picture updates
                  </Text>
                </View>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={moderateScale(24)}
                color={COLORS.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowModal(true);
              }}
              style={[
                styles.settingCard,
                { borderBottomWidth: 1, borderBottomColor: COLORS.border },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                }}
              >
                <View
                  style={[
                    {
                      height: moderateScale(45),
                      width: moderateScale(45),
                      borderRadius: moderateScale(22),
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: COLORS.border,
                    },
                    { backgroundColor: "#fab9b9" },
                  ]}
                >
                  <MaterialIcons
                    name="logout"
                    size={moderateScale(24)}
                    color={COLORS.danger}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      color: COLORS.danger,
                      fontSize: moderateScale(FONT_SIZE.md),
                      fontWeight: "200",
                    }}
                  >
                    Logout
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                    }}
                  >
                    Sign out from your account
                  </Text>
                </View>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={moderateScale(24)}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* popup logout */}
        <PopupModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          onLogout={() => {
            logoutUser();
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileView: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  // profile card
  profileCard: {
    marginTop: verticalScale(100),
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopRightRadius: moderateScale(RADIUS.xl),
    borderTopLeftRadius: moderateScale(RADIUS.xl),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // cover image
  profileImageWrap: {
    height: moderateScale(120),
    width: moderateScale(120),
    borderCurve: "continuous",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: moderateScale(60),
  },
  profileImage: {
    height: "90%",
    width: "90%",
    borderRadius: moderateScale(RADIUS.round),
  },
  fullName: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.xxl),
    textAlign: "center",
    textTransform: "capitalize",
  },
  userEmail: {
    color: COLORS.primary,
    fontSize: moderateScale(FONT_SIZE.md),
    marginBottom: verticalScale(SPACING.xs),
    textAlign: "center",
  },
  bio: {
    maxWidth: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.sm),
    textAlign: "center",
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 1,
    marginVertical: verticalScale(SPACING.sm),
  },
  // profile card header
  profileHeader: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    left: 0,
    bottom: 480,
  },
  userProfileInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(SPACING.sm),
    width: "90%",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: moderateScale(RADIUS.sm),
  },
  userInfoCard: {
    paddingHorizontal: scale(13),
    paddingVertical: verticalScale(7),
    alignItems: "center",
    justifyContent: "center",
  },
  // SETTINGS
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(SPACING.md),
  },
});
