const { default: mongoose } = require("mongoose");

const connectDB = () => {
  try {
    mongoose.set("strictQuery", false);
    const con = mongoose.connect(process.env.MONGOSE_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = connectDB;
