const express = require("express");
const upload = require("../middlewares/multer.middelware");
const router = express.Router();
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const { createPost ,getAllPosts} = require("../controllers/post.controller");

// /api/user/post/create =>> create new post
// /api/user/post/get-posts ====>> fetched all users posts

router.post(
  "/create",
  upload.single("postImage"),
  authUserMiddleware,
  createPost,
);

router.get("/get-posts",authUserMiddleware,getAllPosts)

module.exports = router;
