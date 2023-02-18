const express = require("express");
const {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
} = require("../controllers/productController");
const router = express.Router();
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
router.post("/", isAdmin, authMiddleware, createProduct);
router.get("/:id", getSingleProsduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, authMiddleware, deleteProduct);
router.get("/", isAdmin, authMiddleware, getAllProduct);

module.exports = router;
