const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: "",
    },
    businessEmail: {
      type: String,
      default: "support@iincept.com",
    },
    businessPhone: {
      type: String,
      default: "+91 99999 99999",
    },
    supportHours: {
      type: String,
      default: "Mon – Sat: 9:00 AM to 6:00 PM IST",
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    heroTitle1: {
      type: String,
      default: "Apple devices for your business, sourced right, delivered anywhere in India.",
    },
    heroSubtitle1: {
      type: String,
      default: "Bulk pricing, GST invoicing, dedicated account support and consolidated billing.",
    },
    heroButtonText1: {
      type: String,
      default: "Request Bulk Quote →",
    },
    heroTitle2: {
      type: String,
      default: "The latest Apple lineup, in stock and ready to ship today.",
    },
    heroSubtitle2: {
      type: String,
      default: "From the newest iPhone 17 series to our best-selling MacBooks and AirPods.",
    },
    heroButtonText2: {
      type: String,
      default: "Browse Catalogue →",
    },
    featuredProductIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    shippingCharge: {
      type: Number,
      default: 99,
    },
    taxPercentage: {
      type: Number,
      default: 18,
    },
    freeShippingThreshold: {
      type: Number,
      default: 1499,
    },
    announcement: {
      type: String,
      default: "🔥 FREE SHIPPING ABOVE INR 1499",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
