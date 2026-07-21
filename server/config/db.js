const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("MongoDB Connected to Cloud Atlas");
  } catch (error) {
    console.warn("Cloud MongoDB Atlas Connection Error (IP Whitelist / Network):", error.message);
    console.warn("Attempting Fallback to Local MongoDB...");
    try {
      await mongoose.connect("mongodb://localhost:27017/ecommerce17");
      console.log("MongoDB Connected to Local Database (Fallback)");
    } catch (localError) {
      console.error("Local MongoDB Connection Error:", localError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
