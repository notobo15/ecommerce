const express = require("express");
const productController = require("../controllers/productController");
const { isAmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadimg");
const router = express.Router();
router.get("/", productController.getAllProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  isAmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  productController.uploadImg
);
router.put("/reset-password", authMiddleware, productController.updateProduct);
router.post("/", authMiddleware, isAmin, productController.createProduct);
router.put("/wishlist", authMiddleware, productController.addToWishlist);
router.put("/rating", authMiddleware, productController.rating);
router.get("/:id", productController.getSingleProduct);
router.put("/:id", authMiddleware, isAmin, productController.updateProduct);
router.delete("/:id", authMiddleware, isAmin, productController.deleteProduct);

module.exports = router;
