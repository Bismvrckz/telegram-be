const express = require("express");
const router = express.Router();

const postSignInRouter = require("./post.signIn");

router.use(postSignInRouter);

module.exports = router;
