const { default: axios } = require("axios");
const express = require("express");
const { users, messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const router = express.Router();

async function sendMessageFunction(req, res, next) {
  try {
    // console.log(req.body);
    const { chat_id, text } = req.body;
    const resPostSendMessage = await axios.post(
      "https://api.telegram.org/bot5964112194:AAENMI54OGX4knhivI8xFuKKTRTAgJTfFuk/sendMessage",
      {
        chat_id,
        text,
      }
    );

    const { message_id } = resPostSendMessage.data.result;

    await messages.create({
      user_id: chat_id,
      message_id,
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

async function sendImageMessageFunction(req, res, next) {
  try {
    console.log({ req });
    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/sendMessage", sendMessageFunction);
router.post("sendImageMessage", sendImageMessageFunction);

module.exports = router;
