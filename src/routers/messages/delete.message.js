const { messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const express = require("express");
const router = express.Router();

async function deleteMessageFunction(req, res, next) {
  try {
    const { user_id, message_id } = req.query.message;

    const resDelete = await bot.deleteMessage(user_id, message_id);

    console.log({ resDelete });

    const resDeleteFromDatabase = await messages.destroy({
      where: { message_id },
      force: true,
    });

    console.log({ resDeleteFromDatabase });

    update_front_end();

    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

router.delete("/single", deleteMessageFunction);

module.exports = router;
