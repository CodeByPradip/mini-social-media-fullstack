const express = require("express");
const router = express.Router();
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const { toggleLike } = require("../controllers/like.controller");

// Like / Unlike
router.post("/:postId", authUserMiddleware, toggleLike);

module.exports = router;
