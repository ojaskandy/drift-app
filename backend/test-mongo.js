require("dotenv").config(); // Load environment variables from .env
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

console.log("MONGO_URI:", MONGO_URI); // Debugging

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection successful!");
    process.exit(0); // Exit the script
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // Exit the script with an error
  });
