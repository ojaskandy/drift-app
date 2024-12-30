require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL, // Frontend URL from environment variable
      "http://localhost:3000", // Localhost for development
    ],
    methods: ["GET", "POST"],
  },
});

// Middleware: CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Chat Message Schema
const messageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// Chat-related logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send existing messages to newly connected user
  Message.find()
    .sort({ timestamp: 1 })
    .then((messages) => {
      socket.emit("chat-history", messages);
    })
    .catch((err) => console.error("Error fetching messages:", err));

  // Listen for new chat messages
  socket.on("send-message", (data) => {
    const newMessage = new Message({
      username: data.username,
      text: data.text,
    });

    // Save the message to the database
    newMessage
      .save()
      .then((savedMessage) => {
        io.emit("receive-message", savedMessage); // Broadcast message to all clients
      })
      .catch((err) => console.error("Error saving message:", err));
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Basic API routes
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully");
});

server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
