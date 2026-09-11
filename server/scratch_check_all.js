const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const MONGO_URI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce17";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const setting = await db.collection('settings').findOne({});
    const categories = await db.collection('categories').find({}).toArray();
    let out = { 
      appleCategories: setting?.appleCategories,
      homeCategoryIcons: setting?.homeCategoryIcons,
      categoryIconGroups: setting?.categoryIconGroups,
      categories: categories
    };
    fs.writeFileSync('all_settings.json', JSON.stringify(out, null, 2));
    console.log("SUCCESS");
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

main();
