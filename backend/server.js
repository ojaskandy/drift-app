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
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend URL or localhost
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies/auth token sharing
  })
);
app.use(bodyParser.json());

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
