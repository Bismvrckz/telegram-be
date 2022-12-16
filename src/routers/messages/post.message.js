const { default: axios } = require("axios");
const express = require("express");
const { users, messages } = require("../../../models");
const { message_sent } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const { saveImage, saveDocument } = require("../../controllers/multer");
const {
  sendBotImage,
  sendBotDocument,
} = require("../../components/filesMiddleware");
const path = require("path");
const appRoot = require("app-root-path");
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
        const resSendFile = await bot.sendPhoto(chat_id, imageMessagePath, {
          caption,
        });

        const { photo } = resSendFile;

        const { file_id } = photo[photo.length - 1];

        const resGetFileTeleBot = await bot.getFile(file_id);

        await messages.create({
          user_id: chat_id,
          message_id: resSendFile.message_id,
          messageType: "Image",
          text: caption,
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
          imageMessagePath
        );

        const photo_withCapt = resSendFile_withCapt.photo;

        const file_id_withCapt =
          photo_withCapt[photo_withCapt.length - 1].file_id;

        const resGetFileTeleBot2 = await bot.getFile(file_id_withCapt);

        await messages.create({
          user_id: chat_id,
          message_id: resSendFile_withCapt.message_id,
          messageType: "Image",
          text: "",
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

async function sendDocumentMessageFunction(req, res, next) {
  try {
    let { chat_id, file_ext } = req.params;
    const documentMessagePath = path.join(
      appRoot.path,
      "public",
      "messages",
      "documents",
      `${req.file_storage_id}.${file_ext}`
    );

    const resSendDocumentFileMessage = await bot.sendDocument(
      chat_id,
      documentMessagePath
    );
    const { file_id, file_name } = resSendDocumentFileMessage.document;

    const resGetfile = await bot.getFile(file_id);

    await messages.create({
      user_id: chat_id,
      message_id: resSendDocumentFileMessage.message_id,
      messageType: "Document",
      text: file_name,
      file_url: resGetfile.fileLink,
      is_bot: true,
    });

    update_front_end();

    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(req, res, next);
  }
}

router.post("/sendMessage", sendMessageFunction);
router.post("/sendImageMessage", sendImageUrlMessageFunction);
router.post(
  "/sendImageFileMessage/:chat_id/:caption",
  sendBotImage,
  saveImage.single("image"),
  sendImageFileMessageFunction
);
router.post(
  "/sendDocumentFileMessage/:chat_id/:file_ext",
  sendBotDocument,
  saveDocument.single("document"),
  sendDocumentMessageFunction
);

module.exports = router;
