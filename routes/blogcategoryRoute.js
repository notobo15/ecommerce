const express = require("express");
const blogcategoryController = require("../controllers/blogcategoryController");
const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAmin, blogcategoryController.createCategory);
router.put(
  "/:id",
  authMiddleware,
  isAmin,
  blogcategoryController.updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  isAmin,
  blogcategoryController.deleteCategory
);
router.get("/:id", authMiddleware, blogcategoryController.getSingleCategory);
router.get("/", authMiddleware, blogcategoryController.getListCategory);

module.exports = router;
