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
    origin: ["http://localhost:3000", process.env.FRONTEND_URL || "*"],
    methods: ["GET", "POST"],
  },
});

// Middleware: CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local Development
      "https://drift-app-2hik.vercel.app", // Production Frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies and credentials
  })
);


// Handle Preflight Requests
app.options("*", cors());

app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  username: { type: String, unique: true },
  password: String, // Note: Passwords should be hashed in production!
});
const User = mongoose.model("User", userSchema);

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

// Route: Register New User
app.post("/users/register", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, username, password } = req.body;

    if (!fullName || !email || !phoneNumber || !username || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = new User({
      name: fullName,
      email,
      phoneNumber,
      username,
      password,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error in Register:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already exists." });
    }
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Route: Login User
app.post("/users/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in Login:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Basic API routes
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
