const Brand = require("../models/brandModel");
const validateMongoDB = require("../utils/validateMongodbId");
const asyncHander = require("express-async-handler");

const getListBrand = asyncHander(async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const createBrand = asyncHander(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHander(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const brand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBrand = asyncHander(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);
    const getBrand = await Brand.findById(id);
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHander(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const brand = await Brand.findByIdAndDelete(id);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getListBrand,
  createBrand,
  updateBrand,
  getSingleBrand,
  deleteBrand,
};
