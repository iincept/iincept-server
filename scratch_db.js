require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  const product = await Product.findOne({ title: /MacBook Neo/i });
  console.log("MacBook Neo details:", JSON.stringify(product, null, 2));
  process.exit(0);
};

run().catch(console.error);
