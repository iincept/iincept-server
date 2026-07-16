const express = require("express");
const router = express.Router();
const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCart,
  mergeCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

router.post("/merge", mergeCart);

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route("/:productId")
  .put(updateQuantity)
  .delete(removeFromCart);

module.exports = router;
