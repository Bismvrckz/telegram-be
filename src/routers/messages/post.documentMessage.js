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

    message_sent();

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

router.post(
  "/sendDocumentFileMessage/:chat_id/:file_ext",
  sendBotDocument,
  saveDocument.single("document"),
  sendDocumentMessageFunction
);

module.exports = router;
