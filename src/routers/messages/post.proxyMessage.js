const express = require("express");
const { messages } = require("../../../models");
const { message_sent } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const router = express.Router();

async function proxyMessageFunction(req, res, next) {
  try {
    console.log(req.body, req.params);
    const { destination_id } = req.params;
    const { from, message_id, messageType } = req.body;

    const resForwardBot = await bot.forwardMessage(
      destination_id,
      from,
      parseInt(message_id)
    );

    const { id, is_bot, first_name, username } = resForwardBot.forward_from;

    message_sent();

    await messages.create({
      user_id: destination_id,
      message_id: resForwardBot.message_id,
      messageType,
      is_bot: true,
      text: resForwardBot.text,
      forwarding_status: {
        id,
        is_bot,
        first_name,
        username,
      },
    });

    update_front_end();

    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/proxy/:destination_id", proxyMessageFunction);

module.exports = router;
