require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
// Middleware
app.use(
  cors({
    origin: "https://drift-app-2hik.vercel.app", // Replace with your exact frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary HTTP methods
    credentials: true, // Allow cookies/auth token sharing
    allowedHeaders: ["Content-Type", "Authorization"], // Add headers for preflight
  })
);

// Handle preflight requests
app.options("*", cors());


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Add your route definitions below...

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
