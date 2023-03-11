const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;
const server = http.Server(app);

app.use(cors());
app.use(bodyParser.json());

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.post("/send-sms", (req, res) => {
  const { text, phone } = req.body;
  if (!text || !phone) {
    res.send("Data must be transmitted");
  }
  io.emit("message", { text, phone });
  res.send("Message sent");
});

io.on("connection", (socket) => {
  const { id } = socket;
  console.log(`Socket connected: ${id}`);
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${id}`);
  });
});

server.listen(port, () => console.log(`Server started on port: ${port}`));
