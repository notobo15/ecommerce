const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const validateMongoDB = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");
const cloudinaryUploadImage = require("../utils/cloudinary");

const getListBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.find();
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json({
      status: "success",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json({
      status: "success",
      blog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);
    const getBlog = await Blog.findById(id)
      .populate("likes")
      .populate("dislikes");
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.json(getBlog);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const blog = await Blog.findByIdAndDelete(id);
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // validateMongoDB(blogId);
  //find the blog which you want to like
  const blog = await Blog.findById(blogId);
  //find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isLiked = blog?.isLiked;
  //find if the user has liked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});
const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  // validateMongoDB(blogId);
  //find the blog which you want to like
  const blog = await Blog.findById(blogId);
  //find the login user
  const loginUserId = req?.user?._id;
  //find if the user has liked the blog
  const isDisLiked = blog?.isDisliked;
  //find if the user has liked the blog
  const alreadyLiked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisLiked: true,
      },
      {
        new: true,
      }
    );
    res.json(blog);
  }
});

const uploadImg = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryUploadImage(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getListBlog,
  createBlog,
  updateBlog,
  getSingleBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadImg,
};
