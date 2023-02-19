const Category = require("../models/prodcategoryModel");
const validateMongoDB = require("../utils/validateMongodbId");
const asyncHander = require("express-async-handler");
const createCategory = asyncHander(async (req, res) => {
  try {
    const blog = await Category.create(req.body);
    res.json({
      status: "success",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updateCategory = asyncHander(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);
    const blog = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCategory = asyncHander(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);
    const blog = await Category.findByIdAndDelete(id);
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleCategory = asyncHander(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);
    const blog = await Category.findById(id);
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
const getListCategory = asyncHander(async (req, res) => {
  try {
    const blog = await Category.find();
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getSingleCategory,
  getListCategory,
};
