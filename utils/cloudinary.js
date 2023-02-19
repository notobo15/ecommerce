const cloudinary = require("cloudinary");

// Configuration
cloudinary.config({
  cloud_name: "dchjeckux",
  api_key: "188922494638528",
  api_secret: "IvXY3eXy7nooTML39Xtnx63pwBQ",
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((res, rej) => {
    cloudinary.uploader.upload(fileToUploads, (result) => {
      res(
        {
          url: result.secure_url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = cloudinaryUploadImg;
