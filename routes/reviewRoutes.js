const express = require("express");
const router = express.Router();
const {
  addReview,
  deleteReview,
  getProductReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoint to read reviews
router.get("/:productId", getProductReviews);

// Protected endpoints to write/delete reviews
router.post("/", protect, addReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
