const express = require("express");
const router = express.Router();

const initBotWebhookRouter = require("./init.webhook");

router.use(initBotWebhookRouter);

module.exports = router;
