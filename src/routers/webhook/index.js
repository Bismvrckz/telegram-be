const express = require("express");
const router = express.Router();

const webhookUpdatesRouter = require("./updates");

router.use(webhookUpdatesRouter);

module.exports = router;
