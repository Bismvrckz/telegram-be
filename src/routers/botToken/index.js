const express = require("express");
const router = express.Router();

const initBotWebhookRouter = require("./init.webHook.js");

router.use(initBotWebhookRouter);

module.exports = router;
