const express = require("express");
const router = express.Router();

const getMessagesRouter = require("./get.messages");

router.use(getMessagesRouter);

module.exports = router;
