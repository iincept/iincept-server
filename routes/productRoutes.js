const express = require("express");
const router = express.Router();
const multer = require("multer");
const excelUpload = multer({ storage: multer.memoryStorage() });

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  adminGetStockHistory,
  exportProductsExcel,
  previewImportProductsExcel,
  importProductsExcel,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);

// Excel export & import routes (MUST be before /:id)
router.get("/export-excel", protect, admin, exportProductsExcel);
router.post("/import-preview", protect, admin, excelUpload.single("file"), previewImportProductsExcel);
router.post("/import-excel", protect, admin, excelUpload.single("file"), importProductsExcel);

router.get("/:id", getProductById);

// Protected routes (Admin only)
router.get("/admin/stock-history", protect, admin, adminGetStockHistory);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;

