const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  getUsers,
  updateUserRole,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin-only test route
router.get("/admin-check", protect, admin, (req, res) => {
  res.status(200).json({ message: "Welcome Admin, verification successful" });
});

// Admin-only user management routes
router.get("/users", protect, admin, getUsers);
router.put("/users/:id/role", protect, admin, updateUserRole);

module.exports = router;
