const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getCategories);
router.get("/:slug", getCategory);

// Protected routes (Admin only)
router.post("/", protect, admin, createCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
