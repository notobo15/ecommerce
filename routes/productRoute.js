const express = require("express");
const productController = require("../controllers/productController");
const { isAmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.get("/", productController.getAllProduct);
router.put("/reset-password", authMiddleware, productController.updateProduct);
router.post("/", authMiddleware, isAmin, productController.createProduct);
router.get("/:id", productController.getSingleProduct);
router.put("/:id", authMiddleware, isAmin, productController.updateProduct);
router.delete("/:id", authMiddleware, isAmin, productController.deleteProduct);

module.exports = router;
