const Post = require("../models/post.model");
const Like = require("../models/like.model");

const toggleLike = async (req, res) => {
  try {
    const userId = req.user;
    const { postId } = req.params;

    // Check if user already liked this post
    const existingLike = await Like.findOne({
      postId,
      userId,
    });

    // ===========================
    // Unlike Post
    // ===========================
    if (existingLike) {
      // Delete like document
      await Like.findByIdAndDelete(existingLike._id);

      // Decrease like count
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $inc: {
            likeCount: -1,
          },
        },
        {
          new: true,
        },
      );

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        liked: false,
        likeCount: updatedPost.likeCount,
      });
    }

    // ===========================
    // Like Post
    // ===========================

    await Like.create({
      postId,
      userId,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $inc: {
          likeCount: +1,
        },
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      liked: true,
      likeCount: updatedPost.likeCount,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Like failed",
    });
  }
};

module.exports = {
  toggleLike,
};
