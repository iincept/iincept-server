const express = require("express");
const router = express.Router();
const {
  createCoupon,
  deleteCoupon,
  getCoupons,
  applyCoupon,
} = require("../controllers/couponController");
const { protect, admin } = require("../middleware/authMiddleware");

// Apply Coupon is available to logged-in users
router.post("/apply", protect, applyCoupon);

// CRUD Coupons is admin-only
router.route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route("/:id")
  .delete(protect, admin, deleteCoupon);

module.exports = router;
