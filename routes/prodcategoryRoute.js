const express = require("express");
const prodcategoryController = require("../controllers/prodcategoryController");
const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAmin, prodcategoryController.createCategory);
router.put(
  "/:id",
  authMiddleware,
  isAmin,
  prodcategoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  isAmin,
  prodcategoryController.deleteCategory
);
router.get("/:id", authMiddleware, prodcategoryController.getSingleCategory);
router.get("/", authMiddleware, prodcategoryController.getListCategory);

module.exports = router;
