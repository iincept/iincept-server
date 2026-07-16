const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

router.route("/")
  .get(getWishlist)
  .post(addToWishlist);

router.route("/:productId")
  .delete(removeFromWishlist);

module.exports = router;
