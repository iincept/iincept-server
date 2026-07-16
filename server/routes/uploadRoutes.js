const express = require("express");
const multer = require("multer");
const router = express.Router();
const { uploadSingle, uploadMultiple } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

// Setup Multer memory storage
const storage = multer.memoryStorage();

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

// All upload routes are protected
router.use(protect);

router.post("/single", upload.single("image"), uploadSingle);
router.post("/multiple", upload.array("images", 10), uploadMultiple);

// Error handling middleware for Multer errors
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
