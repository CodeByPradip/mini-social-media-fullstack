const imagekit = require("../config/imagekit");
const likeModel = require("../models/like.model");
const Post = require("../models/post.model");
const userModel = require("../models/user.model");

const createPost = async (req, res) => {
  try {
    const file = req.file;
    const { post } = req.body;
    const userId = req.user;

    if (!post.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "post title required" });
    }

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const base64 = file.buffer.toString("base64");

    // upload to ImageKit
    const result = await imagekit.upload({
      file: base64,
      fileName: file.originalname,
      folder: "/posts",
    });

    const user = await userModel.findOne({
      _id: userId,
    });
    const profileImage = user.profileImages.find((img) => img.isActive);

    const newPost = await Post.create({
      title: post,
      postImage: result?.url,
      owner: userId,
      likeCount: 0,
      commentCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      ...newPost.toObject(),
      user: {
        fullName: user?.fullName,
        profileImage: profileImage?.url,
        email: user?.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Post create failed" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    // 1. Sare posts lao aur owner ki details populate karo
    const posts = await Post.find()
      .populate("owner", "fullName email profileImages")
      .sort({ createdAt: -1 });

    // 2. Frontend ke liye data format karo
    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        // Active profile image nikalo
        const activeImage = post.owner.profileImages.find(
          (img) => img.isActive,
        );

        const existingLike = await likeModel.findOne({
          userId: req.user,
          postId: post._id,
        });

        const isLiked = !!existingLike;

        return {
          _id: post?._id,
          title: post?.title,
          postImage: post?.postImage,
          likeCount: post?.likeCount,
          commentCount: post?.commentCount,
          shareCount: post?.shareCount,
          createdAt: post?.createdAt,
          updatedAt: post?.updatedAt,
          liked: isLiked,

          // Frontend ke liye clean user object
          user: {
            _id: post?.owner?._id,
            fullName: post?.owner?.fullName,
            email: post?.owner?.email,
            profileImage: activeImage?.url || null,
          },
        };
      }),
    );

    console.log("formated posts",formattedPosts);
    

    // 3. Ek hi response bhejo
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: formattedPosts,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Fetch all posts failed",
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
};
