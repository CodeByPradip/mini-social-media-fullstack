const imagekit = require("../config/imagekit");
const userModel = require("../models/user.model");
const friendRequestModel = require("../models/friendRequest.model");

// UPLOAD IMAGE FILE TO CLOUDNERY
const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64 = file.buffer.toString("base64");

    // upload to ImageKit
    const result = await imagekit.upload({
      file: base64,
      fileName: file.originalname,
      folder: "/profiles",
    });

    const user = await userModel.findById(userId);

    // 1. old images inactive karo
    user.profileImages.forEach((img) => {
      img.isActive = false;
    });

    // 2. new image add karo
    user.profileImages.push({
      url: result.url,
      isActive: true,
    });

    // 3. current profile image update karo
    user.profileImage = result.url;

    await user.save();

    res.json({
      message: "Profile image updated with history",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// updateProfile image
const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Duplicate username check
    if (req.body.username) {
      const existingUser = await userModel.findOne({
        username: req.body.username,
        _id: { $ne: userId }, // current user ko ignore karo
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username already exists",
        });
      }
    }

    // =========================
    // Update Text Fields
    // =========================

    if (req.body.username) {
      user.username = req.body.username;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    if (req.body.bio) {
      user.bio = req.body.bio;
    }

    // =========================
    // Update Profile Image
    // =========================

    if (req.file) {
      const file = req.file;

      const base64 = file.buffer.toString("base64");

      const result = await imagekit.upload({
        file: base64,
        fileName: file.originalname,
        folder: "/profiles",
      });

      // Old active image inactive
      user.profileImages.forEach((img) => {
        img.isActive = false;
      });

      // New image add
      user.profileImages.push({
        url: result.url,
        isActive: true,
      });

      // Current profile image
      user.profileImage = result.url;
    }

    // =========================
    // Save User
    // =========================

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};



// get all users

const getAllUsers = async (req, res) => {
  try {
    // Login user id (JWT middleware se)
    const loginUserId = req.user.toString();

    const { search = "" } = req.query;
    // 1. Saare users lao (password mat bhejo)
    const query = {
      _id: { $ne: loginUserId },
    };

    if (search.trim()) {
      query.username = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const users = await userModel.find(query).select("-password").lean();

    // 2. Login user ke saare friend relationships lao

    const relationships = await friendRequestModel
      .find({
        $or: [{ sender: loginUserId }, { receiver: loginUserId }],
      })
      .lean();

    // 3. Relationship Map banao
    // key = otherUserId
    // value = relationship object

    const relationshipMap = new Map();

    for (const relation of relationships) {
      // Dusre user ki id nikalo
      const otherUserId =
        relation.sender.toString() === loginUserId
          ? relation.receiver.toString()
          : relation.sender.toString();

      // Default object
      const relationship = {
        isFriend: false,
        mutualFriendsCount: 0,
        friendRequestSent: false,
        friendRequestReceived: false,
        friendRequestId: relation._id,
      };

      // Friend
      if (relation.status === "accepted") {
        relationship.isFriend = true;
      }

      // Pending Request Sent
      if (
        relation.status === "pending" &&
        relation.sender.toString() === loginUserId
      ) {
        relationship.friendRequestSent = true;
      }

      // Pending Request Received
      if (
        relation.status === "pending" &&
        relation.receiver.toString() === loginUserId
      ) {
        relationship.friendRequestReceived = true;
      }

      relationshipMap.set(otherUserId, relationship);
    }

    // 4. Final Response
    const finalUsers = users.map((user) => {
      const id = user._id.toString();

      // Map se relationship nikalo
      const relation = relationshipMap.get(id);

      const activeImage = user?.profileImages.find((img) => img.isActive);
      // console.log("active image",activeImage);

      return {
        _id: user._id,
        username: user?.username,
        fullName: user?.fullName,
        email: user?.email,
        bio: user?.bio,
        profileImage: activeImage?.url,
        relationship: {
          mutualFriendsCount: relation?.mutualFriendsCount ?? 0,
          isFriend: relation?.isFriend ?? false,
          friendRequestSent: relation?.friendRequestSent ?? false,
          friendRequestReceived: relation?.friendRequestReceived ?? false,
          friendRequestId: relation?.friendRequestId ?? null,
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    console.log(JSON.stringify(finalUsers, null, 2));
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: finalUsers,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

module.exports = {
  updateProfileImage,
  uploadProfileImage,
  getAllUsers,
};
