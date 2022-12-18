const { default: axios } = require("axios");
const express = require("express");
const { messages } = require("../../../models");
const { message_sent, america_fyeah } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const router = express.Router();

async function sendMessageFunction(req, res, next) {
  try {
    const { chat_id, text } = req.body;
    const resPostSendMessage = await axios.post(
      "https://api.telegram.org/bot5964112194:AAENMI54OGX4knhivI8xFuKKTRTAgJTfFuk/sendMessage",
      {
        chat_id,
        text,
      }
    );

    const { message_id } = resPostSendMessage.data.result;

    message_sent();

    await messages.create({
      user_id: chat_id,
      message_id,
      messageType: "Message",
      is_bot: true,
      text,
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

router.post("/sendMessage", sendMessageFunction);

module.exports = router;
