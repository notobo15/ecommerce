const mongoose = require("mongoose");
const valudateMongoDB = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("This id is not valid or not not Found");
  }
};
module.exports = valudateMongoDB;
