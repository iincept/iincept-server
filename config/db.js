const mongoose = require("mongoose");

const connectDB = async () => {
  const localUri = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce17";
  const cloudUri = process.env.MONGO_URI;

  // Priority local connection when USE_LOCAL_DB is true or Atlas fails
  if (process.env.USE_LOCAL_DB === "true") {
    try {
      await mongoose.connect(localUri);
      console.log("MongoDB Connected to Local Database (ecommerce17)");
      return;
    } catch (err) {
      console.warn("Local DB connection error:", err.message);
    }
  }

  try {
    if (cloudUri) {
      await mongoose.connect(cloudUri, {
        serverSelectionTimeoutMS: 2000,
        tls: true,
        tlsAllowInvalidCertificates: true
      });
      console.log("MongoDB Connected to Cloud Atlas");
      return;
    }
  } catch (error) {
    console.warn("Cloud Atlas SSL / IP Whitelist Error:", error.message);
    console.warn("Falling back to Local Database (ecommerce17)...");
  }

  try {
    await mongoose.connect(localUri);
    console.log("MongoDB Connected to Local Database (ecommerce17)");
  } catch (localError) {
    console.error("Local MongoDB Connection Error:", localError.message);
    process.exit(1);
  }
};

module.exports = connectDB;
