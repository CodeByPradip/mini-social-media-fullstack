import { StyleSheet, Text, View } from "react-native";
import React from "react";
import UserAvatar from "./UserAvatar";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../constants/colors";
import { formatTime } from "../utils/formateLastSeen";

const MessageCard = ({ item, isOnline = false, friend, user }) => {
  
  const isMe = user?._id === item?.sender;
  return (
    <View
      style={[
        styles.card,
        {
          alignSelf: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={{
          flexDirection: isMe ? "row-reverse" : "row",
          alignItems: "center",
        }}
      >
        {!isMe && (
          <UserAvatar
            image={
              friend?.profileImage ??
              "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
            }
            isOnline={isOnline}
            size={45}
            dotSize={15}
          />
        )}
        <View
          style={[
            styles.message,
            {
              marginLeft: isMe ? 0 : scale(SPACING.xs),
              marginRight: isMe ? scale(SPACING.xs) : 0,
              backgroundColor: isMe ? COLORS.primary : COLORS.surface,
              borderTopLeftRadius: isMe ? moderateScale(16) : 0,
              borderTopRightRadius: isMe ? 0 : moderateScale(16),
              borderBottomRightRadius: isMe ? 16 : moderateScale(16),
              borderBottomLeftRadius: isMe ? 16 : moderateScale(16),
            },
          ]}
        >
          {item?.type === "text" && (
            <Text style={styles.textMsg}>{item.content}</Text>
          )}

          {item?.type === "image" && (
            <Text style={styles.textMsg}>{item.content}</Text>
          )}
          {item?.type === "video" && (
            <Text style={styles.textMsg}>{item.content}</Text>
          )}
          <View
            style={{
              alignSelf: "flex-end",
            }}
          >
            <Text style={styles.time}>{formatTime(item?.createdAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(MessageCard);

const styles = StyleSheet.create({
  card: {
    maxWidth: "85%",
    marginTop: verticalScale(SPACING.xs),
  },
  message: {
    marginLeft: scale(SPACING.xs),
    padding: moderateScale(9),
    flexShrink: 1,
  },
  textMsg: {
    color: COLORS.text,
    fontSize: moderateScale(FONT_SIZE.sm),
    lineHeight: 20,
    fontWeight: "200",
  },
  time: {
    color: COLORS.textSecondary,
    fontSize: moderateScale(FONT_SIZE.xxs),
    fontWeight: "200",
    textAlign: "right",
  },
});
