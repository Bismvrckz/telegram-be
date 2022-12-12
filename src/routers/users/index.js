const express = require("express");
const router = express.Router();

const getUsersRouter = require("./get.users");

router.use(getUsersRouter);

module.exports = router;
