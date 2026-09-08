const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.USE_LOCAL_DB === 'true' && process.env.LOCAL_MONGO_URI 
  ? process.env.LOCAL_MONGO_URI 
  : process.env.MONGO_URI;

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const setting = await db.collection('settings').findOne({});
    console.log("=== AppleCare Plans in DB ===");
    console.log(JSON.stringify(setting?.appleCarePlans, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

check();
