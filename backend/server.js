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
      process.env.FRONTEND_URL, // Production Frontend
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
  password: String,
  userType: { type: String, enum: ["user", "creator"], default: "user" }, // Add userType
});
const User = mongoose.model("User", userSchema);

// Define Video Schema and Model
const videoSchema = new mongoose.Schema({
  creator: { type: String, required: true }, // Username of the creator
  url: { type: String, required: true }, // Video URL or path
  title: String,
  description: String,
  uploadDate: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", videoSchema);

// Route: Upload Video Metadata
app.post("/videos/upload", async (req, res) => {
  try {
    const { creator, url, title, description } = req.body;

    if (!creator || !url) {
      return res.status(400).json({ error: "Creator and URL are required." });
    }

    const newVideo = new Video({ creator, url, title, description });
    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully!" });
  } catch (err) {
    console.error("Error uploading video:", err);
    res.status(500).json({ error: "Failed to upload video" });
  }
});

// Route: Fetch All Videos (including YouTube and uploaded videos)
app.get("/videos", async (req, res) => {
  try {
    const uploadedVideos = await Video.find().sort({ uploadDate: -1 }); // Sort uploaded videos by upload date
    res.status(200).json(uploadedVideos); // Return only uploaded videos
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// Middleware to Protect Creator Page
const verifyCreator = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(401).json({ error: "Unauthorized: No username provided." });
    }

    const user = await User.findOne({ username });
    if (!user || user.userType !== "creator") {
      return res.status(403).json({ error: "Access denied. Creator access only." });
    }

    next();
  } catch (err) {
    console.error("Error in verifyCreator middleware:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route: Register New User
app.post("/users/register", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, username, password, userType } = req.body;

    if (!fullName || !email || !phoneNumber || !username || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = new User({
      name: fullName,
      email,
      phoneNumber,
      username,
      password,
      userType: userType || "user", // Default to "user" unless specified
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

    res.status(200).json({ username: user.username, userType: user.userType }); // Include userType
  } catch (err) {
    console.error("Error in Login:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Route: Upgrade User to Creator
app.post("/users/upgrade", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (user.userType === "creator") {
      return res.status(400).json({ error: "User is already a creator." });
    }

    user.userType = "creator";
    await user.save();
    res.status(200).json({ message: "User upgraded to creator successfully." });
  } catch (err) {
    console.error("Error in Upgrade:", err);
    res.status(500).json({ error: "Failed to upgrade user to creator." });
  }
});

// Protected Route: Creator Page
app.post("/creator", verifyCreator, (req, res) => {
  res.status(200).send("Welcome to the Creator Page!");
});

// Basic API routes
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
