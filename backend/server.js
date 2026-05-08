require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3005;

connectDB().then(() => {
  // register routes after DB is connected
  app.use("/api/auth",         require("./routes/authRoutes"));
  app.use("/api/game",         require("./routes/gameRoutes"));
  app.use("/api/rooms",        require("./routes/roomRoutes"));
  app.use("/api/user",         require("./routes/userRoutes"));
  app.listen(port, () => console.log(`Listening on port: ${port}`));
}).catch(console.error);