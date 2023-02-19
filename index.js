const express = require("express");
const connectDB = require("./config/connectDB");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRouter = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const blogRoute = require("./routes/blogRoute");
const prodcategoryRoute = require("./routes/prodcategoryRoute");
const blogcategoryRoute = require("./routes/blogcategoryRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

connectDB();

app.use("/api/user", authRouter);
app.use("/api/product", productRoute);
app.use("/api/blog", blogRoute);
app.use("/api/prod-category", prodcategoryRoute);
app.use("/api/blog-category", blogcategoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT = ${PORT}`);
});
