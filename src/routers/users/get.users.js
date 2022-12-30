const express = require("express");
const { users, messages, bots } = require("../../../models");
const router = express.Router();

async function getAllUsers(req, res, next) {
  try {
    const { bot_token } = req.query;
    const userArray = await users.findAll({
      include: messages,
      order: [[messages, "updatedAt", "DESC"]],
      where: { bot_token },
    });

    if (!userArray.length) {
      const isBotExist = await bots.findOne({ where: { bot_token } });
      if (!isBotExist) throw new Error("Bot_token don't exist");
    }

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
