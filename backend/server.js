require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware: CORS Configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, // Frontend URL from environment variable
      "http://localhost:3000",  // Localhost for development
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware: Parse JSON
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  username: { type: String, unique: true },
  password: String, // Note: Should be hashed for production!
});

const User = mongoose.model("User", userSchema);

// Route: Test MongoDB Connection
app.get("/test-mongo", async (req, res) => {
  try {
    const testUser = await User.findOne(); // Use the "User" model
    if (testUser) {
      res.status(200).json({ message: "MongoDB Connected", user: testUser });
    } else {
      res.status(200).json({ message: "MongoDB Connected, but no users found" });
    }
  } catch (err) {
    console.error("MongoDB Query Failed:", err);
    res.status(500).json({ error: "MongoDB Query Failed", details: err });
  }
});

// Route: Basic Test for Backend
app.get("/", (req, res) => {
  res.status(200).send("Backend is running successfully");
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

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
