const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");

const saveImage = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(appRoot.path, "public", "messages", "images"));
    },
    filename: function (req, file, cb) {
      cb(null, `${req.image_storage_id}.png`);
    },
  }),
  limits: {
    fileSize: 8388608,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".jpeg", ".png"];
    const extname = path.extname(file.originalname);
    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        "Invalid file extension. You can only upload jpeg, png file."
      );
      return cb(error);
    }
    cb(null, true);
  },
});

const saveDocument = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(appRoot.path, "public", "messages", "documents"));
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
      console.log({ extname });
      cb(null, `${req.file_storage_id + extname}`);
    },
  }),
  limits: {
    fileSize: 10485760,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".pdf", ".docx", ".txt"];
    const extname = path.extname(file.originalname);
    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        "Invalid file extension. You can only upload pdf, docx, and txt file."
      );
      return cb(error);
    }
    cb(null, true);
  },
});

module.exports = { saveImage, saveDocument };
