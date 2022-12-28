const express = require("express");
const { users, messages } = require("../../../models");
const router = express.Router();

async function getAllUsers(req, res, next) {
  try {
    const { bot_token } = req.query;
    const userArray = await users.findAll({
      include: messages,
      order: [[messages, "updatedAt", "DESC"]],
      where: { bot_token },
    });

    res.send({
      status: "Success",
      httpCode: 200,
      userArray,
    });
  } catch (error) {
    next(error);
  }
}

router.get("/all", getAllUsers);

module.exports = router;
