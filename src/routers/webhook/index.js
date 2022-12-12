const express = require("express");
const router = express.Router();

const webhookUpdatesRouter = require("./updates.webhook");

router.use(webhookUpdatesRouter);

module.exports = router;
