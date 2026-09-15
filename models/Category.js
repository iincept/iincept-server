const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Too short"],
      maxlength: [32, "Too long"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
