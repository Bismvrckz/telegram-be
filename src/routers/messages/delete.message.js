const { messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const express = require("express");
const { users } = require("../../../models");
const router = express.Router();

async function deleteMessageFunction(req, res, next) {
  try {
    const { user_id, message_id, user_message_id, bot_token } = req.query;
    const { chat_id } = (await users.findOne({ where: { user_id } }))
      .dataValues;

    const newBot = await bot({ bot_token });
    await newBot.deleteMessage(chat_id, user_message_id);

    const resDeleteFromDatabase = await messages.destroy({
      where: { message_id },
      force: true,
    });

    update_front_end({ bot_token });

    res.send({
      status: "Success",
      httpCode: 200,
      resDeleteFromDatabase,
    });
  } catch (error) {
    next(error);
  }
}

router.delete("/single", deleteMessageFunction);

module.exports = router;
