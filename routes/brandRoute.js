const express = require("express");
const brandController = require("../controllers/brandController");

const { authMiddleware, isAmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, brandController.getListBrand);
router.post("/", authMiddleware, isAmin, brandController.createBrand);
router.put("/:id", authMiddleware, isAmin, brandController.updateBrand);
router.delete("/:id", authMiddleware, isAmin, brandController.deleteBrand);
router.get("/:id", authMiddleware, brandController.getSingleBrand);

module.exports = router;
