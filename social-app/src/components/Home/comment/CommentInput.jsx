import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { COLORS, RADIUS, SPACING } from "../../../constants/colors";
import UserAvatar from "../../UserAvatar";
import { useProfileImage } from "../../../context/ProfileImageContext";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useComment } from "../../../context/CommentContext";
import { useBottomSheet } from "../../../context/BottomSheetContext";
import { usePost } from "../../../context/PostContext";

const CommentInput = () => {
  const [commentText, setCommentText] = useState("");
  const { getActiveImage } = useProfileImage();
  const { createComment } = useComment();
  const { selectedPost } = useBottomSheet();

  const { increamentCommentCount } = usePost();

  // check current coment post and selected post is same

  // =====================
  // create comment
  // =====================

  const handleCreateComment = async () => {
    if (!commentText) {
      return Alert.alert("Warning!", "Input required");
    }

    setCommentText("");

    const success = await createComment(commentText, selectedPost?._id);
    if (success) {
      increamentCommentCount(selectedPost?._id);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <UserAvatar
          isOnline
          size={35}
          image={
            getActiveImage() ??
            "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg"
          }
        />
        <View style={styles.inputBox}>
          <BottomSheetTextInput
            style={styles.input}
            value={commentText}
            onChangeText={setCommentText}
            keyboardAppearance="dark"
            keyboardType={"default"}
            placeholder="Write a comment..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        <Pressable onPress={handleCreateComment} style={styles.sendBtn}>
          <FontAwesome5
            name="arrow-up"
            size={moderateScale(17)}
            color={COLORS.text}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default CommentInput;

const styles = StyleSheet.create({
  container: {
    height: verticalScale(70),
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    alignSelf: "center",
  },
  inputBox: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: moderateScale(RADIUS.md),
    marginLeft: scale(SPACING.sm),
    paddingHorizontal: scale(SPACING.xs),
    backgroundColor: COLORS.inputBg,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    borderRadius: moderateScale(RADIUS.md),
  },
  sendBtn: {
    height: moderateScale(35),
    width: moderateScale(35),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(RADIUS.round),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: scale(SPACING.xs),
  },
});
