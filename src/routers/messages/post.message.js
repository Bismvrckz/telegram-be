const { default: axios } = require("axios");
const express = require("express");
const { users, messages } = require("../../../models");
const { message_sent } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const { saveImage } = require("../../controllers/multer");
const { sendBotImage } = require("../../components/imageMiddleware");
const path = require("path");
const appRoot = require("app-root-path");
const imageMessagePath = path.join(appRoot.path, "public");
const multer = require("multer");
const upload = multer({ dest: imageMessagePath });
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

async function sendImageMessageFunction(req, res, next) {
  try {
    const { chat_id, URL, caption } = req.body;

    const resSendImageMessageTelegram = await axios.post(
      "https://api.telegram.org/bot5964112194:AAENMI54OGX4knhivI8xFuKKTRTAgJTfFuk/sendPhoto",
      {
        photo: URL,
        chat_id,
        caption,
      }
    );

    const { file_id } = resSendImageMessageTelegram.data.result.photo[3];

    const resGetFileTeleBot = await bot.getFile(file_id);

    message_sent();

    const { result } = resSendImageMessageTelegram.data;

    const createImageMessages = await messages.create({
      user_id: result.chat.id,
      message_id: result.message_id,
      messageType: "Image",
      text: caption,
      imageURL: resGetFileTeleBot.fileLink,
      is_bot: true,
    });

    update_front_end();

    return res.send({
      status: "Success",
      httpCode: 200,
      resTelegramPost: resSendImageMessageTelegram.data,
      createImageMessages,
    });
  } catch (error) {
    next(error);
  }
}

async function sendImageFileMessageFunction(req, res, next) {
  try {
    console.log("Send Image File");
    console.log({ imageMessagePath });
    console.log(req.body);
    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/sendMessage", sendMessageFunction);
router.post("/sendImageMessage", sendImageMessageFunction);
router.post(
  "/sendImageFileMessage/:chat_id",
  sendBotImage,
  upload.single("messagePhoto"),
  sendImageFileMessageFunction
);

module.exports = router;
