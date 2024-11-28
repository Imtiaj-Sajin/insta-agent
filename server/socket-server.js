const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Match Next.js app
    methods: ["GET", "POST"],
  },
});

app.use(express.json()); // Parse JSON body

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Socket received message:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.post("/api/sendMessage", (req, res) => {
  const { message } = req.body;
  console.log("HTTP received message:", message);
  io.emit("receiveMessage", message);
  res.status(200).send("Message sent");
});

server.listen(3001, () => {
  console.log("Socket.IO server running on http://localhost:3001");
});
