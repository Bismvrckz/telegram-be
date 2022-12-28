const express = require("express");
const { messages } = require("../../../models");
const { message_sent } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const { saveDocument } = require("../../controllers/multer");
const { sendBotDocument } = require("../../components/filesMiddleware");
const path = require("path");
const appRoot = require("app-root-path");
const router = express.Router();

async function sendDocumentMessageFunction(req, res, next) {
  try {
    const { chat_id, file_ext } = req.params;
    const { user_id, bot_token } = req.query;

    const documentMessagePath = path.join(
      appRoot.path,
      "public",
      "messages",
      "documents",
      `${req.file_storage_id}.${file_ext}`
    );

    const newBot = await bot({ bot_token });

    const resSendDocumentFileMessage = await newBot.sendDocument(
      chat_id,
      documentMessagePath
    );

    const { file_id, file_name } = resSendDocumentFileMessage.document;

    const { fileLink } = await newBot.getFile(file_id);

    message_sent();

    await messages.create({
      user_id,
      chat_id,
      user_message_id: resSendDocumentFileMessage.message_id,
      messageType: "Document",
      text: file_name,
      file_url: fileLink,
      is_bot: true,
    });

    update_front_end({ bot_token });

    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(req, res, next);
  }
}

router.post(
  "/sendDocumentFileMessage/:chat_id/:file_ext",
  sendBotDocument,
  saveDocument.single("document"),
  sendDocumentMessageFunction
);

module.exports = router;
