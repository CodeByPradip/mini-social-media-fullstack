import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import UserAvatar from "../../UserAvatar";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { COLORS, FONT_SIZE, SPACING } from "../../../constants/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import CommentTime from "./CommentTime";
import { useComment } from "../../../context/CommentContext";
import { usePost } from "../../../context/PostContext";
import { useBottomSheet } from "../../../context/BottomSheetContext";

const CommentCard = ({ item }) => {
  const { deleteComment } = useComment();
  const { dicrementCommentCount } = usePost();
  const { selectedPost } = useBottomSheet();

  // =====================
  // Delete comment
  // =====================
  const handleDeleteComment = async () => {
    const success = await deleteComment(item?._id);
    if (success) {
      dicrementCommentCount(selectedPost?._id);
    }
  };

  return (
    <TouchableOpacity
      onLongPress={handleDeleteComment}
      style={styles.container}
    >
      <View style={styles.avatarWrapper}>
        <UserAvatar
          image={
            item?.user?.profileImage ??
            "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg"
          }
        />
      </View>
      {/* content */}
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{item?.user?.fullName}</Text>
          <CommentTime createdAt={item?.createdAt} />
        </View>
        <Text style={styles.comment}> {item?.comment}</Text>
        <Text style={styles.reply}>Reply</Text>
      </View>
      <View style={styles.right}>
        <Pressable>
          <MaterialCommunityIcons
            name="cards-heart-outline"
            size={moderateScale(24)}
            color={COLORS.text}
          />
        </Pressable>
        <Text style={styles.likeCount}></Text>
      </View>
    </TouchableOpacity>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
  },
  avatarWrapper: {
    marginRight: 12,
  },
  // middle content
  body: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontWeight: "700",
    color: COLORS.text,
  },

  commentWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  comment: {
    marginTop: 2,
    lineHeight: 23,
    color: COLORS.text,
  },
  reply: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  right: {
    width: 45,
    alignItems: "center",
  },
});
