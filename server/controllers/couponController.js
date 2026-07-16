const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");

// Create Coupon (Admin only)
const createCoupon = async (req, res) => {
  try {
    const { code, discount, minimumAmount = 0, expiryDate } = req.body;

    if (!code || discount === undefined || !expiryDate) {
      return res.status(400).json({ message: "Code, discount, and expiry date are required" });
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
      minimumAmount,
      expiryDate,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Coupon (Admin only)
const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(couponId);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Coupons (Admin only)
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply Coupon (Protected, User)
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid coupon code" });
    }

    // Check if expired
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    // Get user's cart items
    const cartItems = await Cart.find({ user: userId }).populate("product");
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const cartTotal = cartItems.reduce((acc, curr) => {
      if (curr.product) {
        return acc + curr.quantity * curr.product.price;
      }
      return acc;
    }, 0);

    // Verify minimum cart amount requirement
    if (cartTotal < coupon.minimumAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount of ₹${coupon.minimumAmount} required. Current total is ₹${cartTotal}.`,
      });
    }

    // Calculate discount amount (assumes percentage discount)
    const discountAmount = Number(((cartTotal * coupon.discount) / 100).toFixed(2));
    const discountedTotal = Number((cartTotal - discountAmount).toFixed(2));

    res.status(200).json({
      success: true,
      code: coupon.code,
      discount: coupon.discount,
      originalTotal: cartTotal,
      discountAmount,
      discountedTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCoupon,
  deleteCoupon,
  getCoupons,
  applyCoupon,
};
