import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SafeAreaView } from "react-native-safe-area-context";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useAllFriends } from "../../context/getFriendsContext";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { formatLastSeen } from "../../utils/formateLastSeen";
import UserAvatar from "../../components/UserAvatar";
import useCurrentTime from "../../hooks/useCurrentTime";
import { useMemo } from "react";

const FriendScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const { allFriends, getAllFriends } = useAllFriends();
  const searching = search.length > 0;

  const currentTime = useCurrentTime();

  useEffect(() => {
    const fetchFriends = async () => {
      await getAllFriends();
    };

    fetchFriends();
  }, []);



  // filter search friends

  const query = search.toLowerCase();
  const filterSearchFriends = useMemo(() => {
   return allFriends.filter((user) => {
      if (
        user.relationship.friendRequestReceived &&
        !user.relationship.isFriend &&
        user.relationship.friendRequstSent
      ) {
        return false;
      }
      const result = user.fullName.toLowerCase().includes(query);
      return result;
    });
  }, [allFriends, search]);

  // render all friends
  const renderAllFriends = ({ item }) => {
    // console.log("online friend", item);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FriendProfile", {
            friendId: item._id,
          });
        }}
        style={styles.card}
      >
        <View style={styles.secondCard}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(SPACING.md),
            }}
          >
            <UserAvatar
              image={
                item?.profileImage ??
                "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
              }
              size={70}
              dotSize={20}
              isOnline={item?.isOnline}
            />
            <View>
              <Text style={styles.fullName}>{item?.fullName}</Text>
              <View style={styles.mutalFriend}>
                <Feather
                  name="users"
                  size={moderateScale(16)}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.mutalText}>
                  {item?.relationship?.mutualFriendsCount} mutual friends
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <Entypo
              name="dots-three-horizontal"
              size={moderateScale(24)}
              color={COLORS.text}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
          }}
        >
          {!item?.isOnline && (
            <Text style={styles.lastSeen}>
              Last seen {formatLastSeen(item?.lastSeen)}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filterSearchFriends}
        renderItem={renderAllFriends}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(SPACING.large),
          paddingTop: verticalScale(SPACING.xxxl),
        }}
        ListHeaderComponent={
          <>
            <View
              style={{
                width: "90%",
                alignSelf: "center",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  marginBottom: verticalScale(SPACING.md),
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.xxl),
                  }}
                >
                  Search Friends{" "}
                </Text>
              </View>
              <View
                style={{
                  height: verticalScale(45),
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(SPACING.sm),
                  paddingHorizontal: scale(SPACING.md),
                  backgroundColor: COLORS.inputBg,
                  borderRadius: moderateScale(RADIUS.lg),
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  overflow: "hidden",
                  paddingRight: scale(SPACING.large),
                }}
              >
                <FontAwesome6
                  name="magnifying-glass"
                  size={moderateScale(24)}
                  color={COLORS.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search friend..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={search}
                  onChangeText={(text) => {
                    setSearch(text);
                  }}
                />
                {searching ? (
                  <Pressable
                    onPress={() => setSearch("")}
                    style={{
                      height: moderateScale(45),
                      width: moderateScale(45),
                      borderRadius: moderateScale(23),
                      backgroundColor: COLORS.border,
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      right: 5,
                    }}
                  >
                    <Fontisto
                      name="close-a"
                      size={moderateScale(14)}
                      color={COLORS.textSecondary}
                    />
                  </Pressable>
                ) : null}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: verticalScale(SPACING.md),
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.lg),
                    fontWeight: "700",
                  }}
                >
                  Your friends
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: moderateScale(FONT_SIZE.sm),
                  }}
                >
                  {`${allFriends.length} friends`}
                </Text>
              </View>
            </View>
          </>
        }
      />
    </View>
  );
};

export default FriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  input: {
    fontSize: moderateScale(FONT_SIZE.md),
    fontWeight: "400",
    color: COLORS.textSecondary,
    flex: 1,
  },
  card: {
    width: "90%",
    alignSelf: "center",
  },
  secondCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(SPACING.lg),
  },
  imageWrap: {
    height: moderateScale(75),
    width: moderateScale(75),
    borderRadius: moderateScale(35),
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(50),
  },
  fullName: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.lg),
    fontWeight: "200",
    textTransform: "capitalize",
  },
  mutalFriend: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(SPACING.xs),
  },
  mutalText: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.xs),
  },
  lastSeen: {
    fontSize: moderateScale(FONT_SIZE.xs),
    color: COLORS.textSecondary,
    fontWeight: "400",
    position: "absolute",
    left: 99,
    bottom: -10,
  },
});
