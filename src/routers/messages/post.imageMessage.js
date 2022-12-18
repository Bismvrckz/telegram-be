const { default: axios } = require("axios");
const express = require("express");
const { messages } = require("../../../models");
const { message_sent } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const { saveImage } = require("../../controllers/multer");
const { sendBotImage } = require("../../components/filesMiddleware");
const path = require("path");
const appRoot = require("app-root-path");
const router = express.Router();

async function sendImageUrlMessageFunction(req, res, next) {
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

    const { photo } = resSendImageMessageTelegram.data.result;

    const { file_id } = photo[photo.length - 1];

    const resGetFileTeleBot = await bot.getFile(file_id);

    message_sent();

    const { result } = resSendImageMessageTelegram.data;

    const createImageMessages = await messages.create({
      user_id: result.chat.id,
      message_id: result.message_id,
      messageType: "Image",
      text: caption,
      file_url: resGetFileTeleBot.fileLink,
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
    let { chat_id, caption } = req.params;
    const imageMessagePath = path.join(
      appRoot.path,
      "public",
      "messages",
      "images",
      `${req.image_storage_id}.png`
    );

    console.log({ imageMessagePath });

    switch (caption) {
      case "empty_user_input":
        const resSendFile = await bot.sendPhoto(chat_id, imageMessagePath);

        const { photo } = resSendFile;

        const { file_id } = photo[photo.length - 1];

        const resGetFileTeleBot = await bot.getFile(file_id);

        await messages.create({
          user_id: chat_id,
          message_id: resSendFile.message_id,
          messageType: "Image",
          text: "",
          file_url: resGetFileTeleBot.fileLink,
          is_bot: true,
        });

        update_front_end();

        return res.send({
          status: "Success",
          httpCode: 200,
        });

      default:
        const resSendFile_withCapt = await bot.sendPhoto(
          chat_id,
          imageMessagePath,
          {
            caption,
          }
        );

        const photo_withCapt = resSendFile_withCapt.photo;

        const file_id_withCapt =
          photo_withCapt[photo_withCapt.length - 1].file_id;

        const resGetFileTeleBot2 = await bot.getFile(file_id_withCapt);

        await messages.create({
          user_id: chat_id,
          message_id: resSendFile_withCapt.message_id,
          messageType: "Image",
          text: caption,
          file_url: resGetFileTeleBot2.fileLink,
          is_bot: true,
        });

        update_front_end();

        res.send({
          status: "Success",
          httpCode: 200,
        });
    }
  } catch (error) {
    next(error);
  }
}

router.post("/sendImageMessage", sendImageUrlMessageFunction);
router.post(
  "/sendImageFileMessage/:chat_id/:caption",
  sendBotImage,
  saveImage.single("image"),
  sendImageFileMessageFunction
);

module.exports = router;
