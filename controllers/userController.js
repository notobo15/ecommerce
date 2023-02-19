const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDB = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const sendEmail = require("./emailController");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });

  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});
//login user
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authrised");
    if (findAdmin) {
      if (findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin._id);
        const updateUser = await User.findByIdAndUpdate(
          findAdmin._id,
          {
            refreshToken: refreshToken,
          },
          {
            new: true,
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000,
        });
        return res.json({
          _id: findAdmin._id,
          firstName: findAdmin.firstName,
          lastName: findAdmin.lastName,
          email: findAdmin.email,
          mobile: findAdmin.mobile,
          token: generateToken(findAdmin._id),
        });
      } else {
        throw new Error("NOT MATCHING PASSWORD");
      }
    }
  } catch (error) {
    throw new Error("Dont Found User");
  }
});
// login admin
const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser) {
      if (findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser._id);
        const updateUser = await User.findByIdAndUpdate(
          findUser._id,
          {
            refreshToken: refreshToken,
          },
          {
            new: true,
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000,
        });
        return res.json({
          _id: findUser._id,
          firstName: findUser.firstName,
          lastName: findUser.lastName,
          email: findUser.email,
          mobile: findUser.mobile,
          token: generateToken(findUser._id),
        });
      } else {
        throw new Error("NOT MATCHING PASSWORD");
      }
    }
  } catch (error) {
    throw new Error("Dont Found User");
  }
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user._id);
    res.json({ accessToken });
  });
});
const updateSingleUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    validateMongoDB(_id);
    const findUser = await User.findOneAndUpdate(
      _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const findAllUser = await User.find();
    res.json(findAllUser);
  } catch (error) {
    throw new Error(error);
  }
});
const getSingleUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDB(id);

    const findAUser = await User.findById(id);
    res.json(findAUser);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteSingleUser = asyncHandler(async (req, res) => {
  try {
    const id = res.params;
    validateMongoDB(id);
    const findAUser = await User.findOneAndDelete({ id });
    res.json(findAUser);
  } catch (error) {
    throw new Error(error);
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);

  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    await res.json({
      message: `User ${id} blocked`,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDB(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    await res.json({
      message: `User ${id} unblocked`,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDB(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatePassword = await user.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
});
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    const data = {
      to: email,
      text: "Hey User",
      subject: "forgot password link",
      html: "Hi, Please follow this link to reset your...",
    };
    sendEmail(data);
    await user.save();
  } catch (error) {
    throw new Error(error);
  }
});
const getWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
const saveAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  validateMongoDB(_id);
  try {
    let products = [];
    const user = await User.findById(_id);

    const alreadyExistCart = await Cart.findOne({ orderby: user._id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();
    res.json(newCart);
    console.log(products, carstTotal);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const cart = await Cart.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.send(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findOne({ _id: id });
    const cart = await Cart.findOneAndRemove({
      orderby: user.id,
    });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id: id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAffterDiscount = (cartTotal =
    (cartTotal * validCoupon.discount) / 100).toFixed(2);
  const cart = await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAffterDiscount },
    { new: true }
  );
  res.json(cart);
});

const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { id } = req.user;
  console.log(id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await Cart.findById(id);
    let userCart = await Cart.findOne({ orderby: id });
    let finalAmount = 0;
    if (couponApplied && userCart.totalAffterDiscount) {
      finalAmount = userCart.totalAffterDiscount * 100;
    } else {
      finalAmount = userCart.cartTotal * 100;
    }
    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: finalAmount,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: +item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ massage: "success" });
  } catch (error) {
    throw new Error(error);
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { status } = req.params;

  try {
    const updateOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.send(updateOrder);
  } catch (error) {
    throw new Error(error);
  }
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const userOrders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .exec();
    res.send(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
};
