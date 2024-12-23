require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Update to handle production
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  username: { type: String, unique: true },
  password: String, // Note: Should be hashed in production!
});

const preferenceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  productId: String,
  reaction: String, // "Like" or "Meh"
});

const User = mongoose.model("User", userSchema);
const Preference = mongoose.model("Preference", preferenceSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Register New User
app.post("/users/register", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, username, password } = req.body;

    if (!fullName || !email || !phoneNumber || !username || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newUser = new User({ name: fullName, email, phoneNumber, username, password });
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

// Login Existing User
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

// Record a reaction
app.post("/preferences", async (req, res) => {
  try {
    const { userId, productId, reaction } = req.body;

    if (!userId || !productId || !reaction) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newPreference = new Preference({ userId, productId, reaction });
    await newPreference.save();
    res.status(201).json(newPreference);
  } catch (err) {
    console.error("Error in Recording Reaction:", err);
    res.status(500).json({ error: "Failed to record preference" });
  }
});

// Get all preferences for a user
app.get("/preferences/:userId", async (req, res) => {
  try {
    const preferences = await Preference.find({ userId: req.params.userId });
    res.status(200).json(preferences);
  } catch (err) {
    console.error("Error in Fetching Preferences:", err);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
