const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logout);
router.get("/list", userController.getAllUser);
router.get("/refresh", userController.handleRefreshToken);
router.get("/:id", authMiddleware, isAmin, userController.getSingleUser);
router.delete("/:id", userController.deleteSingleUser);
router.put("/edit", authMiddleware, userController.updateSingleUser);
router.put("/block-user/:id", authMiddleware, isAmin, userController.blockUser);
router.put(
  "/unblock-user/:id",
  authMiddleware,
  isAmin,
  userController.unblockUser
);
module.exports = router;
