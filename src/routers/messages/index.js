const express = require("express");
const router = express.Router();

const postMessage = require("./post.message");

router.use(postMessage);

module.exports = router;
