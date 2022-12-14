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
    cb(null, `${req.image_id}.png`);
  },
});

const saveImage = multer({
  storage: imageMessageStorage,
  limits: {
    fileSize: 10485760,
  },
});

module.exports = { saveImage };
