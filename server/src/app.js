const express = require("express");
const dns = require("dns");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const friendRRequestoutes = require("./routes/friendRequest.routes");
const messageRoutes = require("./routes/message.route");
const postRoutes = require("./routes/post.route");
const likeRoutes = require("./routes/like.route");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/auth", authRutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendRRequestoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user/post/", postRoutes);
app.use("/api/user/like", likeRoutes);

module.exports = app;
