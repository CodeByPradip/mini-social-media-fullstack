import { View, StyleSheet, FlatList } from "react-native";
import { COLORS, SPACING } from "../../constants/colors";
import { scale, verticalScale } from "react-native-size-matters";
import HeaderTop from "../../components/Home/HomeTopHeader";
import HeaderBottom from "../../components/Home/HeaderBottom";
import ThirdHeader from "../../components/Home/ThirdHeader";
import { usePost } from "../../context/PostContext";
import { useBottomSheet } from "../../context/BottomSheetContext";
import { useCallback } from "react";
import PostCard from "../../components/Home/PostCard"

const HomeScreen = ({ navigation }) => {
  const { postsData } = usePost();
  const { openCommentSheet } = useBottomSheet();

  // Render posts
  // ===============
  const renderPosts = useCallback(({ item, index }) => {
    return (
      <PostCard onOpenComments={openCommentSheet} index={index} item={item} />
    );
  }, []);

  return (
    <View style={{ backgroundColor: COLORS.background }}>
      <FlatList
        ListHeaderComponent={
          <>
            <HeaderTop />
            <View style={styles.header}>
              <View>
                <HeaderBottom />
              </View>
            </View>
            <ThirdHeader onPress={() => navigation.navigate("PostCreate")} />
          </>
        }
        contentContainerStyle={styles.container}
        data={postsData}
        renderItem={renderPosts}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingTop: verticalScale(SPACING.large),
    gap: scale(SPACING.sm),
    paddingBottom: verticalScale(70),
  },
  header: {
    marginBottom: verticalScale(SPACING.sm),
  }, // post card
});
