const express = require("express");
const router = express.Router();
const {
  uploadProfileImage,
  updateProfileImage,
  getAllUsers,
} = require("../controllers/user.controller");
const upload = require("../middlewares/multer.middelware");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

// UPDATE PROFILE    API /api/user/upload
// SEARCH ALL USERS FROM API  =- GET   http://localhost:3000/api/user/search?query=girl



router.post(
  "/profile-image/upload",
  authUserMiddleware,
  upload.single("image"),
  uploadProfileImage,
);
router.patch(
  "/profile-image/update",
  authUserMiddleware,
  upload.single("profileImage"),
  updateProfileImage,
);



router.get("/get-users", authUserMiddleware, getAllUsers); // /api/user/get-users

module.exports = router;
