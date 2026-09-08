import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iincept');
    console.log('Connected to MongoDB');

    const categories = await Category.find({});
    console.log('\n--- CATEGORIES ---');
    categories.forEach(c => console.log(`ID: ${c._id}, Name: "${c.name}", Slug: "${c.slug}"`));

    const products = await Product.find({}).populate('category');
    console.log(`\n--- ALL PRODUCTS (${products.length}) ---`);
    products.forEach(p => {
      console.log(`ID: ${p._id}, Title: "${p.title}", Stock: ${p.stock}, Category: "${p.category?.name || p.category}"`);
    });

    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
