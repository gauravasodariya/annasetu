const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/annasetu";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    if (
      typeof err.message === "string" &&
      err.message.includes("ENOTFOUND") &&
      uri.startsWith("mongodb+srv://")
    ) {
      console.error(
        "SRV lookup failed. Verify your Atlas URI or use a non-SRV mongodb:// URI."
      );
    }
    process.exit(1);
  }
};

module.exports = connectDB;
