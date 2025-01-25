require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const multer = require("multer"); // Import multer for file uploads
const path = require("path"); // For handling file paths
const fs = require("fs");
const { Server } = require("socket.io");
const { Storage } = require("@google-cloud/storage"); // Import Google Cloud Storage

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 10000;

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
      process.env.FRONTEND_URL || "https://drift-app-2hik.vercel.app", // Production Frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow cookies and credentials
  })
);

// Serve Static Files for Uploaded Videos
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve video files from 'uploads' folder

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

// Google Cloud Storage setup
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucket = storage.bucket(process.env.BUCKET_NAME);

// Multer configuration for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  username: { type: String, unique: true },
  password: String,
  userType: { type: String, enum: ["user", "creator"], default: "user" },
});
const User = mongoose.model("User", userSchema);

// Define Video Schema and Model
const videoSchema = new mongoose.Schema({
  creator: { type: String, required: true }, // Username of the creator
  url: { type: String, required: true }, // Video URL or file path
  title: String,
  description: String,
  uploadDate: { type: Date, default: Date.now },
});
const Video = mongoose.model("Video", videoSchema);

// Function to upload file to Google Cloud Storage
const uploadToGoogleCloud = async (file) => {
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  return new Promise((resolve, reject) => {
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", (err) => {
        reject(err);
      })
      .end(file.buffer);
  });
};

// Route: Upload Video
app.post("/videos/upload", upload.single("file"), async (req, res) => {
  try {
    const { creator, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Google Cloud Storage
    const publicUrl = await uploadToGoogleCloud(req.file);

    const newVideo = new Video({
      creator,
      url: publicUrl,
      title: title || "Untitled Video",
      description: description || "",
    });

    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully!", video: newVideo });
  } catch (err) {
    console.error("Error uploading video:", err.message);
    res.status(500).json({ error: `Failed to upload video: ${err.message}` });
  }
});

// Route: Get Creator's Uploaded Videos
app.get("/videos/creator/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    const videos = await Video.find({ creator: username }).sort({ uploadDate: -1 }); // Most recent first
    res.status(200).json(videos);
  } catch (err) {
    console.error("Error fetching creator's videos:", err.message);
    res.status(500).json({ error: `Failed to fetch videos: ${err.message}` });
  }
});

// Route: Fetch All Videos (for Discover page)
app.get("/videos", async (req, res) => {
  try {
    const uploadedVideos = await Video.find().sort({ uploadDate: -1 }); // Sort videos by upload date
    res.status(200).json(uploadedVideos);
  } catch (err) {
    console.error("Error fetching videos:", err.message);
    res.status(500).json({ error: `Failed to fetch videos: ${err.message}` });
  }
});

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
    console.error("Error in Register:", err.message);
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already exists." });
    }
    res.status(500).json({ error: `Failed to register user: ${err.message}` });
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

    // Return user's name along with username and userType
    res.status(200).json({
      fullName: user.name,
      username: user.username,
      userType: user.userType,
    });
  } catch (err) {
    console.error("Error in Login:", err.message);
    res.status(500).json({ error: `Failed to login: ${err.message}` });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
