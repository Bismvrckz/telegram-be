const express = require("express");
const router = express.Router();

const postSignInRouter = require("./init.webHook.js");

router.use(initBotWebhookRouter);

module.exports = router;
