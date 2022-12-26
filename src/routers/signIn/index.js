const express = require("express");
const router = express.Router();

const postSignInRouter = require("./init.webHook.js");

router.use(postSignInRouter);

module.exports = router;
