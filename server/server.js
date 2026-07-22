require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const initalizedSocket = require("./src/socket/socket");
const connectDB = require("./src/config/db");
connectDB();

const PORT = process.env.PORT;
/*
|--------------------------------------------------------------------------
| Create HTTP Server
|--------------------------------------------------------------------------
|
| Express app ko directly listen nahi karayenge.
| Socket.io ko HTTP Server chahiye hota hai.
|
*/
const server = http.createServer(app);

/*
|--------------------------------------------------------------------------
| Create Socket Server
|--------------------------------------------------------------------------
*/

const io = new Server(server, {
  cors: "*",
  methods: ["GET", "POST"],
});

initalizedSocket(io);
/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

server.listen(PORT, () => {
  console.log("server is running on port 3000");
});
