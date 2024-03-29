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
    const { chat_id, user_id, bot_token, image_url, caption } = req.body;

    const newBot = await bot({ bot_token });
    const resNewBot = await newBot.sendPhoto(chat_id, image_url, {
      caption,
    });

    const { photo } = resNewBot;

    const { file_id } = photo[photo.length - 1];

    const { fileLink } = await newBot.getFile(file_id);

    message_sent();

    const { chat, message_id } = resNewBot;

    const createImageMessages = await messages.create({
      user_id,
      chat_id: chat.id,
      user_message_id: message_id,
      messageType: "Image",
      text: caption,
      file_url: fileLink,
      is_bot: true,
    });

    update_front_end({ bot_token });

    return res.send({
      status: "Success",
      httpCode: 200,
      resTelegramPost: resNewBot,
      createImageMessages,
    });
  } catch (error) {
    next(error);
  }
}

async function sendImageFileMessageFunction(req, res, next) {
  try {
    let { chat_id, caption } = req.params;
    const { user_id, bot_token } = req.query;

    const imageMessagePath = path.join(
      appRoot.path,
      "public",
      "messages",
      "images",
      `${req.image_storage_id}.png`
    );

    const newBot = await bot({ bot_token });
    console.log({ imageMessagePath });

    switch (caption) {
      case "empty_user_input":
        const resSendFile = await newBot.sendPhoto(chat_id, imageMessagePath);

        const { photo } = resSendFile;

        const { file_id } = photo[photo.length - 1];

        var { fileLink } = await newBot.getFile(file_id);

        var createMessage = await messages.create({
          user_id,
          chat_id,
          user_message_id: resSendFile.message_id,
          messageType: "Image",
          text: "",
          file_url: fileLink,
          is_bot: true,
        });

        update_front_end({ bot_token });

        return res.send({
          status: "Success",
          httpCode: 200,
          resSendFile,
          createMessage,
        });

      default:
        const resSendFile_withCapt = await newBot.sendPhoto(
          chat_id,
          imageMessagePath,
          {
            caption,
          }
        );

        const photo_withCapt = resSendFile_withCapt.photo;

        const file_id_withCapt =
          photo_withCapt[photo_withCapt.length - 1].file_id;

        var { fileLink } = await newBot.getFile(file_id_withCapt);

        var createMessage = await messages.create({
          user_id,
          chat_id,
          user_message_id: resSendFile_withCapt.message_id,
          messageType: "Image",
          text: caption,
          file_url: fileLink,
          is_bot: true,
        });

        update_front_end({ bot_token });

        res.send({
          status: "Success",
          httpCode: 200,
          resSendFile_withCapt,
          createMessage,
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
