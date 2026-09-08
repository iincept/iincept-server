const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce17";

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;
    const setting = await db.collection('settings').findOne({});
    let out = {};
    if (setting) {
      if (setting.categoryIconGroups) {
        const macGroup = setting.categoryIconGroups.find(g => g.categoryKey === 'mac');
        out.macGroup = macGroup;
      }
      if (setting.navbarMenuItems) {
        const macItem = setting.navbarMenuItems.find(i => (i.name || '').toLowerCase().includes('mac'));
        out.macNavbarItem = macItem;
      }
    }
    fs.writeFileSync('out.json', JSON.stringify(out, null, 2));
    console.log("SUCCESS");
    process.exit(0);
  } catch (err) {
    fs.writeFileSync('out.json', JSON.stringify({ error: err.message }, null, 2));
    process.exit(1);
  }
}

main();
