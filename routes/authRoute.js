const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/admin-login", userController.loginAdmin);
router.put("/reset-password", userController.updatePassword);
router.get("/logout", userController.logout);
router.get("/list", userController.getAllUser);
router.post("/cart", authMiddleware, userController.userCart);
router.get("/cart", authMiddleware, userController.getUserCart);
router.delete("/empty-cart", authMiddleware, userController.emptyCart);
router.post("/cart/applycoupon", authMiddleware, userController.applyCoupon);
router.post("/cart/cash-order", authMiddleware, userController.createOrder);
router.get("/get-orders", authMiddleware, userController.getOrders);
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAmin,
  userController.updateOrderStatus
);
router.get("/refresh", userController.handleRefreshToken);
router.get("/:id", authMiddleware, isAmin, userController.getSingleUser);
router.get("/wishlist", authMiddleware, userController.getWishList);
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
