const Message = require("../models/message.model");

const getMessages = async (req, res) => {
  try {
    const { friendId } = req.params;
    const loginUser = req.user;

    const messages = await Message.find({
      $or: [
        {
          sender: loginUser,
          receiver: friendId,
        },
        {
          sender: friendId,
          receiver: loginUser,
        },
      ],
    }).sort({ createdAt: 1 });

    if (!messages) {
      return res
        .status(401)
        .json({ success: false, message: "Message not found" });
    }

    return res.status(201).json({
      success: true,
      message: "Message fetched successfully",
      messages,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "messages fetch faild" });
  }
};

module.exports = { getMessages };
