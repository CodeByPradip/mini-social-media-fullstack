import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  moderateScale,
  scale,
  ScaledSheet,
  verticalScale,
} from "react-native-size-matters";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../../constants/colors";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import UserAvatar from "../../components/UserAvatar";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MessageCard from "../../components/MessageCard";
import { formatLastSeen } from "../../utils/formateLastSeen";
import { useAllFriends } from "../../context/getFriendsContext";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/authContext";
import useCurrentTime from "../../hooks/useCurrentTime";
import { useCallback } from "react";

const MessageScreen = ({ navigation, route }) => {
  // Global Context
  const { friendId } = route.params;
  const { user, getMessages } = useAuth();
  const { allFriends } = useAllFriends();
  const { socket } = useSocket();
  const currentTime = useCurrentTime();

  // Local States
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  const friend = allFriends.find((fr) => fr?._id === friendId);

  // load old messages
  useEffect(() => {
    const loadMessages = async () => {
      const messageHistory = await getMessages(friend?._id);

      const currentChat = messageHistory.filter(
        (message) =>
          (message.sender === user?._id && message?.receiver === friend?._id) ||
          (message.sender === friend?._id && message?.receiver === user?._id),
      );

      setMessages(currentChat || []);
    };

    loadMessages();
  }, [friend?._id, user?._id]);

  // sender message
  useEffect(() => {
    const handleMessageSent = (serverMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === serverMessage.tempId ? serverMessage : msg,
        ),
      );
    };

    socket.on("message-sent", handleMessageSent);

    return () => {
      socket.off("message-sent", handleMessageSent);
    };
  }, [socket]);

  // friend screen receive message
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("received => ", data);

      const isFriendMessage =
        data?.sender === friend?._id && data?.receiver === user?._id;

      if (isFriendMessage) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket, friend?._id, user?._id]);

  // send message
  const handleSendMessage = () => {
    if (!message) return;

    const tempId = `temp-${Date.now()}`;

    const data = {
      _id: tempId,
      tempId,
      sender: user?._id,
      receiver: friend?._id,
      content: message,
      type: "text",
      createdAt: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, data]);

    socket.emit("send-message", data);

    setMessage("");
  };

  // ===============================
  // Render all chats
  // ================================

  const renderChats = useCallback(
    ({ item }) => {
      return (
        <MessageCard
          user={user}
          isOnline={friend?.isOnline}
          friend={friend}
          item={item}
        />
      );
    },
    [user, friend],
  );
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          {/* header */}
          <View style={styles.header}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(SPACING.sm),
              }}
            >
              <Pressable onPress={() => navigation.goBack()}>
                <Feather
                  name="arrow-left"
                  size={moderateScale(25)}
                  color={COLORS.text}
                />
              </Pressable>
              <View>
                <UserAvatar
                  image={
                    friend?.profileImage ??
                    "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
                  }
                  size={47}
                  dotSize={16}
                  isOnline={friend?.isOnline}
                />
              </View>
              <View>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: moderateScale(FONT_SIZE.sm),
                  }}
                >
                  {friend?.fullName}
                </Text>
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: FONT_SIZE.xs,
                  }}
                >
                  {friend?.isOnline
                    ? ` Active now`
                    : `last seen ${formatLastSeen(friend?.lastSeen)}`}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(SPACING.md),
              }}
            >
              <Pressable>
                <Ionicons
                  name="call-outline"
                  size={moderateScale(20)}
                  color={COLORS.text}
                />
              </Pressable>
              <Pressable>
                <Ionicons
                  name="videocam-outline"
                  size={moderateScale(20)}
                  color={COLORS.text}
                />
              </Pressable>
              <Pressable>
                <AntDesign
                  name="ellipsis"
                  size={moderateScale(26)}
                  color={COLORS.text}
                />
              </Pressable>
            </View>
          </View>
          {/* chats lists  */}
          <FlatList
            ref={flatListRef}
            style={{ flex: 1 }}
            data={messages}
            renderItem={renderChats}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: "95%",
              alignSelf: "center",
              paddingTop: verticalScale(SPACING.md),
              paddingBottom: verticalScale(20),
            }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListHeaderComponent={
              <>
                <View
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginBottom: verticalScale(SPACING.lg),
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: moderateScale(FONT_SIZE.sm),
                      textAlign: "center",
                    }}
                  >
                    Today
                  </Text>
                  <View>
                    <View
                      style={{
                        padding: moderateScale(10),
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        backgroundColor: COLORS.surface,
                        width: "85%",
                        borderRadius: moderateScale(RADIUS.lg),
                        paddingVertical: verticalScale(12),
                        borderRadius: moderateScale(RADIUS.md),
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.textSecondary,
                          fontSize: moderateScale(FONT_SIZE.xs),
                          flexDirection: "row",
                          textAlign: "center",
                          lineHeight: 20,
                        }}
                      >
                        <Ionicons
                          name="lock-closed-outline"
                          size={moderateScale(17)}
                          color={COLORS.textSecondary}
                        />{" "}
                        Messages are end-to-end encrypted No one outside of this
                        chat, not even WhatsApp,canreador listen to them.
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            }
          />
          {/* input  */}
          <View style={styles.inputContainer}>
            <Pressable style={styles.addBtn}>
              <FontAwesome6
                name="add"
                size={moderateScale(21)}
                color={COLORS.text}
              />
            </Pressable>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={COLORS.textSecondary}
                value={message}
                onChangeText={setMessage}
              />
              <View style={{}}>
                <MaterialIcons
                  name="attach-file"
                  size={moderateScale(24)}
                  color={COLORS.text}
                />
              </View>
            </View>
            <Pressable onPress={handleSendMessage} style={styles.sendBtn}>
              <Feather
                name="send"
                size={moderateScale(24)}
                color={COLORS.text}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: verticalScale(60),
  },
  imgWrap: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    borderRadius: moderateScale(40),
  },
  inputContainer: {
    height: verticalScale(50),
    width: "95%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: moderateScale(RADIUS.round),
    alignItems: "center",
    padding: moderateScale(10),
    paddingHorizontal: scale(SPACING.md),
  },
  addBtn: {
    height: moderateScale(35),
    width: moderateScale(35),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: scale(SPACING.xs),
  },
  input: {
    flex: 1,
    color: COLORS.text,
    paddingHorizontal: scale(SPACING.xs),
    fontSize: moderateScale(FONT_SIZE.sm),
  },
  sendBtn: {
    marginLeft: scale(SPACING.xs),
  },
});
