import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Setting from './models/Setting.js';

async function updateAppleCareLabels() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/iincept';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const setting = await Setting.findOne();
    if (setting) {
      let modified = false;

      if (Array.isArray(setting.navbarMenuItems)) {
        setting.navbarMenuItems.forEach(item => {
          if (item.name === 'AppleCare' || item.name === 'Get AppleCare') {
            item.name = 'AppleCare+';
            modified = true;
          }
          if (Array.isArray(item.dropdownItems)) {
            item.dropdownItems.forEach(d => {
              if (d.label === 'AppleCare' || d.label === 'Get AppleCare') {
                d.label = 'AppleCare+';
                modified = true;
              }
            });
          }
        });
      }

      if (Array.isArray(setting.appleCategories)) {
        setting.appleCategories.forEach(item => {
          if (item.name === 'AppleCare' || item.name === 'Get AppleCare') {
            item.name = 'AppleCare+';
            modified = true;
          }
          if (Array.isArray(item.dropdownItems)) {
            item.dropdownItems.forEach(d => {
              if (d.label === 'AppleCare' || d.label === 'Get AppleCare') {
                d.label = 'AppleCare+';
                modified = true;
              }
            });
          }
        });
      }

      if (modified) {
        await setting.save();
        console.log('Successfully updated AppleCare to AppleCare+ in database!');
      } else {
        console.log('No AppleCare items needed modification in database.');
      }
    } else {
      console.log('No setting document found in database.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error updating DB:', err);
    process.exit(1);
  }
}

updateAppleCareLabels();
