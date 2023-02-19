const express = require("express");
const couponController = require("../controllers/couponController");
const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAmin, couponController.createCoupon);
router.put("/:id", authMiddleware, isAmin, couponController.updateCoupon);
router.delete("/:id", authMiddleware, isAmin, couponController.deleteCoupon);
router.get("/", authMiddleware, isAmin, couponController.getListCoupon);
router.get("/:id", authMiddleware, isAmin, couponController.getSingleCoupon);

module.exports = router;
