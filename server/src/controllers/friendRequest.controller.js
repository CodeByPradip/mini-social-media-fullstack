const { default: mongoose } = require("mongoose");
const friendRequestModel = require("../models/friendRequest.model");
const userModel = require("../models/user.model");

// SENT FRIEND REQUEST API /api/friends/request
const sendRequest = async (req, res) => {
  //  1 login user ki id nikalo
  //  2 reciver ki id nikalo
  //  3 reciver user database mai hai ki nai check karna hoga
  //  4 user khudki id mai toh friend request nai kar raha check karna hoga | sender._id === reciver._id get throw
  //  5 check karna hoga ki already pendig request hai ki nai
  //  6 check karna hoga ki already friend toh nai hai ?
  //  7 agar sab sahi hai toh friend request create karo

  try {
    const userId = req.user;
    const { username } = req.body;

    // check username is not empty
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "username required" });
    }

    // check recevir user is exits database
    const receiver = await userModel.findOne({ username });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    // check receiver id user id not equal
    if (receiver._id.equals(userId)) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to your self " });
    }

    // check friend request has already pending
    const alredyPendingRequest = await friendRequestModel.findOne({
      sender: userId,
      receiver: receiver._id,
      status: "pending",
    });

    if (alredyPendingRequest) {
      return res.status(409).json({ message: "Friend request already send" });
    }

    // check incoming request is pending
    const incomingRequest = await friendRequestModel.findOne({
      sender: receiver._id,
      receiver: userId,
      status: "pending",
    });

    if (incomingRequest) {
      return res.status(409).json({
        message:
          "This user has already sent you a friend request. Please accept or reject it.",
      });
    }

    // check both user are already accepted request or friends
    const already = await friendRequestModel.findOne({
      $or: [
        {
          sender: userId,
          receiver: receiver._id,
          status: "accepted",
        },
        {
          sender: receiver._id,
          receiver: userId,
          status: "accepted",
        },
      ],
    });

    if (already) {
      return res.status(409).json({
        message: "Already accept requested or friends",
      });
    }

    // create friend request
    const friendRequest = await friendRequestModel.create({
      sender: userId,
      receiver: receiver._id,
    });

    return res.status(201).json({
      message: "Friend request send successfully",
      friendRequest,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Friend request failed" });
  }
};

// ACCEPT FRIEND REQUEST API /api/friends/request/:requestId/accept <== id mai friend collection ka id dena hai
const acceptRequest = async (req, res) => {
  // 1. Login user ki id nikalo (req.user)
  // 2. Params se requestId nikalo
  // 3. Check requestId valid hai ki nahi
  // 4. Friend request database me exist karti hai ya nahi
  // 5. Check request pending hai ya nahi
  // 6. Check login user hi receiver hai ya nahi (receive id hi friend request accept karsakta hai.)
  // 7. Friend request ko accepted update karo

  try {
    const receiverId = req.user;
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "request id invalid" });
    }

    // find friend request document
    const friendRequest = await friendRequestModel.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    const validateReceiver = friendRequest.receiver.equals(receiverId);

    // check request.recever === recevierId
    if (!validateReceiver) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // check request already accepted
    if (friendRequest.status === "accepted") {
      return res.status(409).json({
        message: "Friend request already accepted",
      });
    }

    // update accepted user pending => accepted or

    friendRequest.status = "accepted";
    await friendRequest.save();

    return res.status(200).json({
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Accept request failed" });
  }
};

// CANCLE FRIEND REQUEST API /api/friends/request/:requestId/cancle
const cancleRequest = async (req, res) => {
  // 1 Login user id लो → req.user
  // 2 requestId लो
  // 3 Validate requestId
  // 4 Friend Request document निकालो
  // 5 Document नहीं मिला → 404
  // 6 Check friendRequest.sender === req.user
  // अगर नहीं → 403 Forbidden
  // Check status === "pending"
  // अगर pending नहीं → 409
  // Document delete करो
  // Success response

  try {
    // 1 Login user id लो → req.user
    const canclerUserId = req.user; // login user id
    const { requestId } = req.params; // friend collection id
    console.log("request id ", requestId);

    // 3 Validate requestId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "request id invalid" });
    }

    // 3 Validate requestId
    if (!requestId) {
      return res.status(400).json({ message: "request id invalid" });
    }

    // 4 Friend Request document निकालो
    const friendRequest = await friendRequestModel.findById(requestId);
    console.log("friend request collection", friendRequest);
    // 5 Document नहीं मिला → 404
    if (!friendRequest) {
      return res.status(404).json({ message: "Forbidden" });
    }

    // 6 Check friendRequest.sender === req.user
    if (!friendRequest.sender.equals(req.user)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    if (friendRequest.status !== "pending") {
      return res.status(409).json({
        message: "Friend request is not pending",
      });
    }

    await friendRequest.deleteOne();

    return res.status(200).json({
      message: "Friend request cancelled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Request cancle failed" });
  }
};

// FRIEND REQUEST REJECTED BY RECEIVER API /api/friends/request/:requestId/reject
const rejectRequest = async (req, res) => {
  // 1 Login user id लो → req.user
  // 2 requestId लो
  // 3 Validate requestId
  // 4 Friend Request document निकालो
  // 5 Document नहीं मिला → 404
  // 6 Check friendRequest.sender === req.user
  // अगर नहीं → 403 Forbidden
  // Check status === "pending"
  // अगर pending नहीं → 409
  // Document delete करो
  // Success response

  try {
    // login user lao req.user && friend colection id lao req.params.requestId
    const loginUser = req.user; // login user
    const { requestId } = req.params; // friend collection id;

    // check karo request id valid hai ki nai
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "request id invalid" });
    }
    if (!requestId) {
      return res.status(400).json({ message: "invalid collection id" });
    }
    // get friend request collection id using requestId
    const friendRequest = await friendRequestModel.findById(requestId);
    // check document is validate
    if (!friendRequest) {
      return res
        .status(400)
        .json({ message: "friend collection is not found" });
    }
    // check friend request.sender !== req.user ? Forbidden 403 : continue
    if (!friendRequest.receiver.equals(req.user)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    // check friendrequest.status === pending ? done delete : 409
    if (friendRequest.status !== "pending") {
      return res.status(409).json({ message: "friend request is not pending" });
    }
    // all are good to go and delete friend request document
    await friendRequest.deleteOne();

    // sent success message
    return res.status(200).json({
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Request reject failed" });
  }
};

// GET ALL REQUEST CURRENT USER FROM FRIEND DOCUMENT API /api/requests
const getAllRequests = async (req, res) => {
  try {
    // Login user id
    const userId = req.user;

    // Get all incoming pending friend requests
    const requests = await friendRequestModel
      .find({
        receiver: userId,
        status: "pending",
      })
      .populate("sender", "username profile cover")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Friend requests fetched successfully",
      totalRequests: requests.length,
      requests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch friend requests",
    });
  }
};

// GET CURRENT USER FRIENDS FROM FRIEND DOCUMENT  =- GET /api/friends/get
const getAllFriends = async (req, res) => {
  try {
    const userId = req.user.toString();

    // Current user ke accepted friends
    const relationships = await friendRequestModel
      .find({
        status: "accepted",
        $or: [{ sender: userId }, { receiver: userId }],
      })
      .populate(
        "sender",
        "username fullName email bio profileImages cover  lastSeen createdAt updatedAt",
      )
      .populate(
        "receiver",
        "username fullName email bio profileImages cover  lastSeen createdAt updatedAt",
      )
      .lean();

    const friends = await Promise.all(
      relationships.map(async (relation) => {
        const friend =
          relation.sender._id.toString() === userId
            ? relation.receiver
            : relation.sender;

        const activeImage =
          friend.profileImages?.find((img) => img.isActive)?.url || null;

        const friendsCount = await friendRequestModel.countDocuments({
          status: "accepted",
          $or: [{ sender: friend._id }, { receiver: friend._id }],
        });

        return {
          _id: friend._id,
          username: friend.username,
          fullName: friend.fullName,
          email: friend.email,
          bio: friend.bio,
          cover: friend.cover,
          profileImage: activeImage,
          friendsCount,
          postCount: 0,
          lastSeen: friend.lastSeen,
          relationship: {
            isFriend: true,
            mutualFriendsCount: 0,
            friendRequestSent: false,
            friendRequestReceived: false,
            friendRequestId: relation._id,
          },
          createdAt: friend.createdAt,
          updatedAt: friend.updatedAt,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      message: "Friends fetched successfully",
      totalFriends: friends.length,
      friends,
    });
  } catch (error) {
    console.error(error);

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get current opend profile friend
// GET FRIEND PROFILE
// GET /api/friends/:friendId
const getCurrFriend = async (req, res) => {
  try {
    const loginUserId = req.user;
    const { friendId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id",
      });
    }

    // Get Friend
    const user = await userModel.findById(friendId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Active profile image
    const activeImage =
      user.profileImages.find((img) => img.isActive)?.url || null;

    // Online Status
    const online = getOnlineStatus(user);

    // Check friendship
    const relationship = await friendRequestModel.findOne({
      status: "accepted",
      $or: [
        {
          sender: loginUserId,
          receiver: friendId,
        },
        {
          sender: friendId,
          receiver: loginUserId,
        },
      ],
    });

    // Friends Count
    const friendsCount = await friendRequestModel.countDocuments({
      status: "accepted",
      $or: [{ sender: friendId }, { receiver: friendId }],
    });

    return res.status(200).json({
      success: true,
      message: "Friend profile fetched successfully",
      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        cover: user.cover,
        profileImage: activeImage,

        lastSeen: user.lastSeen,

        friendsCount,
        mutualFriendsCount: 0, // Future feature

        relationship: {
          isFriend: !!relationship,
          friendRequestSent: false,
          friendRequestReceived: false,
        },

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  cancleRequest,
  rejectRequest,
  getAllRequests,
  getAllFriends,
  getCurrFriend,
};
