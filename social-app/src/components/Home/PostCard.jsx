import React, { useCallback } from "react";

import * as Animatable from "react-native-animatable";
import { usePost } from "../../context/PostContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import Feather from "@expo/vector-icons/Feather";
import UserAvatar from "../../components/UserAvatar";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import { useAuth } from "../../context/authContext";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import PostTime from "./PostTime";
import { useAllFriends } from "../../context/getFriendsContext";
import { useComment } from "../../context/CommentContext";
import Loder from "../Loder";
import { useBottomSheet } from "../../context/BottomSheetContext";

const AnimatableButton = Animatable.createAnimatableComponent(TouchableOpacity);

const PostCard = ({ item, index, onOpenComments }) => {
  const { optimisticLike, likeUnlikePost } = usePost();

  const { user } = useAuth();
  const { allFriends } = useAllFriends();
  const { getAllComments, commentsByPost, clearComment, loadingComments } =
    useComment();
  const { selectedPost } = useBottomSheet();
  // ===============================
  // check friends are online or not
  // ===============================
  const isOnline =
    item?.user?._id === user?._id
      ? true
      : (allFriends.find((friend) => friend._id === item.user._id)?.isOnline ??
        false);

  // =======================
  // liked unliked featchers
  // ======================
  const handleLikeCount = async (item) => {
    optimisticLike(item._id);
    await likeUnlikePost(item._id);
  };

  // ==================
  // Open bottom sheet
  // ==================
  const openBottomSheet = useCallback(async () => {
    clearComment();
    onOpenComments(item);
    if (!commentsByPost[item._id]) {
      await getAllComments(item._id);
    }
  }, [item]);

  return (
    <AnimatableButton
      key={item?._id}
      activeOpacity={1}
      animation={"fadeInUp"}
      direction={400}
      useNativeDriver={true}
      delay={index * 200}
      style={styles.postCard}
    >
      {/* post header */}
      <View style={styles.postHeader}>
        <View style={styles.postLeft}>
          <View style={styles.postUserImgwrapper}>
            <UserAvatar
              image={
                item?.user?.profileImage ??
                "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg"
              }
              isOnline={isOnline}
            />
          </View>
          <View style={styles.postInfo}>
            <Text style={styles.postUsername}>{item?.user?.fullName}</Text>
            <Text numberOfLines={2} style={styles.postEmail}>
              {item?.user?.email}
            </Text>
          </View>
        </View>
        <View style={styles.postRight}>
          <PostTime createdAt={item?.createdAt} />
          <TouchableOpacity>
            <Entypo
              name="dots-three-horizontal"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* post sub header */}
      <View style={styles.postSubHeader}>
        <Text numberOfLines={3} style={styles.subPostTitle}>
          {item?.title}
        </Text>
      </View>

      {/* post image */}

      <View style={styles.postImgWrapper}>
        <Image
          resizeMode="cover"
          style={styles.postImg}
          source={{ uri: item?.postImage }}
        />
      </View>
      <View style={styles.postLikeComment}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(SPACING.sm),
          }}
          onPress={() => {
            handleLikeCount(item);
          }}
        >
          {item?.liked ? (
            <FontAwesome
              name="heart"
              size={moderateScale(24)}
              color={COLORS.danger}
            />
          ) : (
            <Feather
              name="heart"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          )}
          <Text style={styles.postLikeCount}>{item?.likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(SPACING.sm),
          }}
          onPress={openBottomSheet}
        >
          <FontAwesome5
            name="comment"
            size={moderateScale(24)}
            color={COLORS.text}
          />
          <Text style={styles.postLikeCount}>{item?.commentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(SPACING.sm),
          }}
        >
          <FontAwesome5
            name="share"
            size={moderateScale(24)}
            color={COLORS.text}
          />
          <Text style={styles.postLikeCount}>{item?.shareCount}</Text>
        </TouchableOpacity>
      </View>
    </AnimatableButton>
  );
};

export default React.memo(PostCard);

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: COLORS.surface,
    marginTop: verticalScale(SPACING.sm),
    paddingVertical: verticalScale(SPACING.lg),
    shadowColor: COLORS.black,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
    borderColor: COLORS.border,
    borderRadius: moderateScale(RADIUS.lg),
    borderCurve: "continuous",
    width: "100%",
  },
  // post header
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(SPACING.lg),
  },
  postLeft: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  postUserImgwrapper: {
    height: verticalScale(45),
    width: scale(48),
    borderRadius: moderateScale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  postUserImg: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(100),
  },
  postUsername: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.sm),
    fontWeight: "400",
  },
  postEmail: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.xs),
    fontWeight: "500",
  },
  postRight: {
    flexDirection: "row",
    gap: scale(SPACING.sm),
  },

  // post sub header
  postSubHeader: {
    alignSelf: "flex-start",
    width: "100%",
    marginTop: verticalScale(SPACING.sm),
    paddingHorizontal: scale(SPACING.lg),
  },
  subPostTitle: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.sm),
    fontWeight: "400",
  },
  // post image
  postImgWrapper: {
    width: "100%",
    overflow: "hidden",
    marginTop: verticalScale(SPACING.md),
  },
  postImg: {
    width: "100%",
    aspectRatio: 1, // temporary
  },
  // post  coment likes share count
  postLikeComment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: scale(SPACING.xxl),
    marginTop: verticalScale(SPACING.md),
    paddingHorizontal: scale(SPACING.lg),
  },
  postLikeCount: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.sm),
    fontWeight: "300",
  },
});
