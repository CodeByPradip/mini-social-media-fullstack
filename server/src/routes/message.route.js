const express = require("express");
const { getMessages } = require("../controllers/message.controller");
const { authUserMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/get-messages/:friendId", authUserMiddleware, getMessages);

module.exports = router;
