const express = require("express");
const { messages } = require("../../../models");
const { message_sent } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const router = express.Router();

async function sendMessageFunction(req, res, next) {
  try {
    const { chat_id, text, user_id, bot_token } = req.body;
    const newBot = await bot({ bot_token });
    const resBotSendMessage = await newBot.sendMessage(chat_id, text);

    const { message_id } = resBotSendMessage;

    message_sent();

    const resCreateMessage = await messages.create({
      user_id,
      chat_id,
      user_message_id: message_id,
      messageType: "Message",
      is_bot: true,
      text,
    });

    update_front_end({ bot_token });

    res.send({
      status: "Success",
      httpCode: 200,
      resBotSendMessage,
      resCreateMessage,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/sendMessage", sendMessageFunction);

module.exports = router;
