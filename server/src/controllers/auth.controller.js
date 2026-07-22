const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const friendRequestModel = require("../models/friendRequest.model");

// USER REGISTER API /api/auth/signup
const registerUser = async (req, res) => {
  const { username, fullName, email, phone, password } = req.body;
  if (!username || !fullName || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //   check user is already exist
  try {
    const userAlreadyExits = await userModel.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (userAlreadyExits) {
      return res.status(409).json({ message: "User already exits" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username: username,
      fullName: fullName,
      email: email,
      phone: phone,
      password: hashPassword,
    });

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        isOnline: true,
        lastSeen: new Date(),
      },
      {
        new: true,
      },
    );

    const friendsCount = await friendRequestModel.countDocuments({
      status: "accepted",
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

    return res.status(200).json({
      success: true,
      message: "User login successfully",

      token: generateToken(updatedUser._id),

      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,

        stats: {
          friendsCount,
        },
      },
    });
  } catch (error) {
    console.log("register failed");
    return res.status(500).json({ message: "User Register failed" });
  }
};

// USER LOGIN API /api/auth/login
const loginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    const user = await userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatchedPass = await bcrypt.compare(password, user.password);

    if (!isMatchedPass) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        isOnline: true,
        lastSeen: new Date(),
      },
      {
        new: true, // 👈 updated document return karega
      },
    );

    console

    const friendsCount = await friendRequestModel.countDocuments({
      status: "accepted",
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

    return res.status(200).json({
      success: true,
      message: "User login successfully",

      token: generateToken(updatedUser._id),

      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,

        stats: {
          friendsCount,
        },
      },
    });
  } catch (error) {
    console.log("User login failed");
    return res.status(500).json({ message: "User login failed" });
  }
};

// GET CURRENT USER DATA  API /api/auth/get-me

const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Friends Count
    const friendsCount = await friendRequestModel.countDocuments({
      status: "accepted",
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

    // Future
    const postsCount = 0;
    // const postsCount = await postModel.countDocuments({
    //     user: user._id
    // });

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",

      user: {
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        cover: user.cover,
        profileImages: user.profileImages,

        isOnline: user.isOnline,
        lastSeen: user.lastSeen,

        stats: {
          friendsCount,
          postsCount,
        },

        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// LOGOUT CURRENT USER   API /api/auth/logout

const logoutUser = async (req, res) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user,
      {
        isOnline: false,
        lastSeen: new Date(),
      },
      {
        new: true,
      },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// CHANGE PASSWORD API /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const userId = req.user;
    const { oldPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatchedPass = await bcrypt.compare(oldPassword, user.password);
    if (!isMatchedPass) {
      return res.status(404).json({ message: "Old Password is incorrect" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Password Change successfully" });
  } catch (error) {
    console.log(errror);
    return res.status(500).json({ message: "Server Error" });
  }
};



module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
};
