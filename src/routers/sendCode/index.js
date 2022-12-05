const express = require("express");
const router = express.Router();

const postSendCodeRouter = require("./post.sendCode");

router.use(postSendCodeRouter);

module.exports = router;
