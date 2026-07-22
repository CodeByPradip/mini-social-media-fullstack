const onlineUsers = new Map();
const Message = require("../models/message.model");
const userModel = require("../models/user.model");

initalizedSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User Connected :", socket.id);

    // user register
    socket.on("register-user", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);

      console.log("user registered");
      console.log("user id", userId);
      console.log("scket id", socket.id);
      console.log("online users", onlineUsers);

      // onlineUsers userid
      const usersIds = [...onlineUsers.keys()];
      console.log("users ids", usersIds);

      io.emit("online-users", usersIds);
      console.log("✅ send users id");
    });

    // client send message event
    socket.on("send-message", async (data) => {
      const { sender, receiver, content, type, status, tempId } = data;
      try {
        console.log("Received Data:", data);

        const messageSaved = await Message.create({
          sender,
          receiver,
          content,
          type,
          status: "sent",
        });

        const response = {
          ...messageSaved.toObject(),
          tempId,
        };

        socket.emit("message-sent", response);

        const receiverSocketId = onlineUsers.get(receiver);
        console.log("Receiver Socket :", receiverSocketId);

        // check isRecever is online
        if (!receiverSocketId) {
          console.log("receiver offline");
          return;
        }

        // server send message to recever use receiverSocket id
        io.to(receiverSocketId).emit("receive-message", response);
        console.log("✅ Message Delivered");

        console.log("Saved:", response);
      } catch (err) {
        console.log(err);
      }
    });

    // user offline
    socket.on("disconnect", async () => {
      try {
        const updatedUser = await userModel.findByIdAndUpdate(
          socket.userId,
          {
            lastSeen: Date.now(),
          },
          {
            returnDocument: "after",
          },
        );

        const { _id, lastSeen } = updatedUser;

        // Remove from online users
        onlineUsers.delete(socket.userId);

        // Update everyone's online list
        io.emit("online-users", [...onlineUsers.keys()]);

        // Send last seen update
        io.emit("offline-user", {
          userId: _id,
          lastSeen,
        });

        console.log("❌ User Disconnected :", socket.id);
      } catch (error) {
        console.log("user offline failed", error);
      }
    });
  });
};

module.exports = initalizedSocket;
