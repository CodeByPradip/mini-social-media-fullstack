const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Kisne message bheja
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Kisko message bheja
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Message Type
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },

    // Text Message
    content: {
      type: String,
      trim: true,
      default: "",
    },

    // Image / Video / Audio / File URL
    mediaUrl: {
      type: String,
      default: "",
    },

    // File Name (optional)
    fileName: {
      type: String,
      default: "",
    },

    // File Size
    fileSize: {
      type: Number,
      default: 0,
    },

    // Seen Status
    isSeen: {
      type: Boolean,
      default: false,
    },

    // Delivered Status
    isDelivered: {
      type: Boolean,
      default: false,
    },

    // Message Deleted For Everyone
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "seen"],
      default: "sent",
    },

    // Reply Feature
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Message", messageSchema);
