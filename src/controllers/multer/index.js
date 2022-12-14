const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");

const imageMessagePath = path.join(
  appRoot.path,
  "public",
  "messages",
  "images"
);

const imageMessageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageMessagePath);
  },
  filename: function (req, file, cb) {
    const { image_id } = req;
    console.log({ image_id });
    cb(null, `${image_id}.png`);
  },
});

const saveImage = multer({
  storage: imageMessageStorage,
  limits: {
    fileSize: 1048576,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".png", ".jpg", ".jpeg"];

    const extname = path.extname(file.originalname);

    console.log({ extname });

    if (!allowedExtension.includes(extname)) {
      const error = new error(
        "Please upload a valid extension (jpg, jpeg, png)."
      );
      return cb(error);
    }

    cb(null, true);
  },
});

module.exports = { saveImage };
