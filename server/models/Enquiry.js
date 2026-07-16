const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Contact name is required"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },
    email: {
      type: String,
      required: [true, "Work email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    gstin: {
      type: String,
    },
    productInterest: {
      type: String,
      required: [true, "Product of interest is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    targetPrice: {
      type: Number,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
