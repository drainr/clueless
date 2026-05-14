const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { connectDB } = require("./config/db");
const registerGameSockets = require("./sockets/gameSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth",  require("./routes/authRoutes"));
app.use("/api/game",  require("./routes/gameRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/user",  require("./routes/userRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));

registerGameSockets(io);

const port = process.env.PORT || 3005;
server.listen(port, () => console.log(`Listening on port: ${port}`));

connectDB().catch(err => console.error("DB connection failed:", err));