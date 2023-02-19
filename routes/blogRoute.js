const express = require("express");
const blogController = require("../controllers/blogController");
const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadimg");
const router = express.Router();

router.get("/", blogController.getListBlog);
router.post("/", authMiddleware, isAmin, blogController.createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAmin,
  uploadPhoto.array("images", 10),
  blogImgResize,
  blogController.uploadImg
);
router.put("/likes", authMiddleware, blogController.likeBlog);
router.put("/dislikes", authMiddleware, blogController.dislikeBlog);
router.get("/:id", blogController.getSingleBlog);
router.put("/:id", authMiddleware, isAmin, blogController.updateBlog);
router.delete("/:id", authMiddleware, isAmin, blogController.deleteBlog);

module.exports = router;
