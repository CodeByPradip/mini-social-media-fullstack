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
import React, { useState } from "react";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import UserAvatar from "../../../components/UserAvatar";
import { useProfileImage } from "../../../context/ProfileImageContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as ImagePicker from "expo-image-picker";
import { usePost } from "../../../context/PostContext";
import Loder from "../../../components/Loder";

const PostCreate = ({ navigation }) => {
  // ==================
  // STATES
  // ==================
  const [isFoucsed, setIsFocused] = useState(false);
  const { getActiveImage } = useProfileImage();
  const [post, setPost] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  // ====================
  // Global Context
  // ====================
  const { addNewPost, loading } = usePost();
  // select image form expo image pickker

  const imagePicker = async () => {
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
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }
    console.log("post image select ", result.assets[0]);
    setSelectedPost(result.assets[0]);
  };

  // =====================
  // Handle post
  // =====================

  const handlePost = async () => {
    if (!post.trim() || !selectedPost) {
      Alert.alert(
        "Incomplete Post",
        "Please add a title and select an image before publishing your post.",
      );
      return;
    }
    try {
      const formData = new FormData();

      formData.append("postImage", {
        uri: selectedPost.uri,
        name: selectedPost.fileName || "profile.jpg",
        type: selectedPost.mimeType || "image/jpeg",
      });

      formData.append("post", post);

      const result = await addNewPost(formData);
      if (result.success === true) {
        Alert.alert("success", "post added");
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loder />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
        }}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <AntDesign
              name="close"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          </Pressable>
          <Text
            style={{
              color: COLORS.text,
              fontSize: moderateScale(FONT_SIZE.lg),
              fontWeight: "200",
            }}
          >
            Create Post
          </Text>
          <Pressable onPress={handlePost} style={styles.button}>
            <Text
              style={{
                textAlign: "center",
                color: COLORS.text,
                fontSize: moderateScale(FONT_SIZE.md),
              }}
            >
              Post
            </Text>
          </Pressable>
        </View>
        <View style={styles.userCard}>
          <UserAvatar
            image={
              getActiveImage() ??
              "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg"
            }
            isOnline
            size={50}
            dotSize={16}
          />
          <View
            style={{
              marginLeft: scale(SPACING.sm),
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: moderateScale(FONT_SIZE.md),
                fontWeight: "300",
              }}
            >
              Pratikshya khadka
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(SPACING.xs),
              }}
            >
              <FontAwesome5
                name="globe-americas"
                size={moderateScale(17)}
                color={COLORS.textSecondary}
              />
              <Text
                style={{
                  color: COLORS.textSecondary,
                  fontSize: moderateScale(FONT_SIZE.sm),
                }}
              >
                Public
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={moderateScale(27)}
                color={COLORS.textSecondary}
              />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.inputContainer,
            { borderColor: isFoucsed ? COLORS.primary : COLORS.text },
          ]}
        >
          <TextInput
            value={post}
            onChangeText={setPost}
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor={COLORS.textSecondary}
            multiline
            textAlignVertical="top"
            autoCorrect
            autoCapitalize="sentences"
            selectionColor={COLORS.primary}
            scrollEnabled
            maxLength={2000}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            cursorColor={COLORS.primary}
            autoFocus
            keyboardAppearance="dark"
          />
        </View>
        <TouchableOpacity
          onPress={imagePicker}
          activeOpacity={0.8}
          style={styles.addPhoto}
        >
          {selectedPost && (
            <TouchableOpacity
              onPress={() => {
                setSelectedPost(null);
              }}
              style={styles.unselectImage}
            >
              <AntDesign
                name="close"
                size={moderateScale(27)}
                color={COLORS.text}
              />
            </TouchableOpacity>
          )}
          {selectedPost ? (
            <Image
              source={{
                uri: selectedPost.uri,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome6
                name="image"
                size={moderateScale(30)}
                color={COLORS.success}
              />
              <View
                style={{
                  marginLeft: scale(SPACING.sm),
                }}
              >
                <Text
                  style={{
                    color: COLORS.success,
                    fontSize: moderateScale(FONT_SIZE.lg),
                  }}
                >
                  Add Photo / Video
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                  }}
                >
                  Tap to select from gallery
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: verticalScale(54),
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(13),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(RADIUS.sm),
    borderCurve: "continuous",
  },
  userCard: {
    width: "90%",
    alignSelf: "center",
    marginTop: verticalScale(SPACING.xs),
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    width: "90%",
    alignSelf: "center",
    padding: moderateScale(10),
    borderWidth: 0.5,
    marginTop: verticalScale(SPACING.xxxl),
    borderRadius: moderateScale(RADIUS.md),
    borderCurve: "circular",
    backgroundColor: COLORS.surface,
  },
  input: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.md),
    minHeight: verticalScale(140),
    maxHeight: verticalScale(350),
    lineHeight: 28,
    textAlignVertical: "top",
  },
  addPhoto: {
    minHeight: verticalScale(150),
    maxHeight: verticalScale(275),
    width: "90%",
    alignSelf: "center",
    borderRadius: moderateScale(RADIUS.md),
    padding: moderateScale(10),
    borderWidth: 0.5,
    borderColor: COLORS.text,
    marginTop: verticalScale(SPACING.xxl),
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  // selected post image
  image: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(RADIUS.md),
  },
  unselectImage: {
    position: "absolute",
    top: 13,
    right: 15,
    zIndex: 2,
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(40 / 2),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.divider,
  },
});
