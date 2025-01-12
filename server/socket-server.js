const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");

const dailyPerformanceJob = require("./dailyPerformanceJob.js");
const backgroundTaskAutoDMCM = require("./autoDmComment.js");
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

  // Start background task (continuous loop)
  (async () => {
    console.log("Starting the background task...");
    await backgroundTaskAutoDMCM();
  })().catch((error) => console.error("Background task error:", error));

  console.log('test');
  
  // ----------------performance test---------
  // Run dailyPerformanceJob every minute in parallel
  setInterval(async () => {
    try {
      console.log("Running dailyPerformanceJob...");
      await dailyPerformanceJob();
      console.log("dailyPerformanceJob completed successfully.");
    } catch (error) {
      console.error("Error during dailyPerformanceJob:", error);
    }
  }, 60000); 
});
