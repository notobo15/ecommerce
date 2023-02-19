const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDB = require("../utils/validateMongodbId");
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
const getListCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.find();
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);
    const coupon = await Coupon.findById(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const coupon = await Coupon.findByIdAndDelete(id);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCoupon,
  getListCoupon,
  deleteCoupon,
  getSingleCoupon,
  updateCoupon,
};
