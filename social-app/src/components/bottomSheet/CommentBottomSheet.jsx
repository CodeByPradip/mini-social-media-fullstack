import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCallback, useRef } from "react";
import { useBottomSheet } from "../../context/BottomSheetContext";
import { useComment } from "../../context/CommentContext";
import CommentInput from "../Home/comment/CommentInput";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLORS, FONT_SIZE } from "../../constants/colors";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CommentCard from "../Home/comment/CommentCard";

const CommentBottomSheet = () => {
  const { bottomSheetRef, snapPoints, closeCommentSheet } = useBottomSheet();
  const flatListRef = useRef(null);

  const { commentsByPost } = useComment();
  // ===================
  // Render comments
  // ===================
  const renderComment = ({ item }) => {
    return <CommentCard item={item} />;
  };

  // ==========================
  // commet input footer component
  // ==========================

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props}>
        <CommentInput />
      </BottomSheetFooter>
    ),
    [],
  );
  const CommentsHeader = () => {
    return (
      <View style={styles.commentsHeader}>
        <View style={styles.dragHandle} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "90%",
          }}
        >
          <View></View>
          <Text style={styles.commentsTitle}>
            Comments ({commentsByPost.length})
          </Text>
          <Pressable
            onPress={() => {
              closeCommentSheet();
            }}
          >
            <AntDesign
              name="close"
              size={moderateScale(23)}
              color={COLORS.text}
            />
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      footerComponent={renderFooter}
      backgroundStyle={{
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
      }}
    >
      <BottomSheetFlatList
        data={commentsByPost}
        renderItem={renderComment}
        keyExtractor={(item) => item?._id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.commentContainer}
        ListHeaderComponent={CommentsHeader}
     
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: moderateScale(FONT_SIZE.xl),
              }}
            >
              No comment found
            </Text>
          </View>
        }
      />
    </BottomSheet>
  );
};

export default CommentBottomSheet;

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: COLORS.surface,
    paddingBottom: 100,
    flexGrow: 1,
  },
  commentsHeader: {
    alignItems: "center",
    paddingBottom: verticalScale(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  dragHandle: {
    width: scale(42),
    height: verticalScale(5),
    borderRadius: 100,
    backgroundColor: "#6B7280",
    marginBottom: verticalScale(8),
  },

  commentsTitle: {
    color: COLORS.text,
    fontSize: moderateScale(17),
    fontWeight: "700",
  },
});
