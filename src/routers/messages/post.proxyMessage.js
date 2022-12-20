const express = require("express");
const { message_sent } = require("../../components/alerts");
const bot = require("../../components/telebot");
const {
  textProxy,
  imageProxy,
  documentProxy,
} = require("../../controllers/botProxy");
const router = express.Router();

async function proxyMessageFunction(req, res, next) {
  try {
    const { destination_id } = req.params;
    const { from, message_id } = req.body;

    const resForwardBot = await bot.forwardMessage(
      destination_id,
      from,
      parseInt(message_id)
    );

    message_sent();

    if (resForwardBot.photo) {
      return imageProxy({ req, res, next, resForwardBot, fromBot: true });
    } else if (resForwardBot.document) {
      return documentProxy({ req, res, next, resForwardBot, fromBot: true });
    } else {
      return textProxy({ req, res, next, resForwardBot, fromBot: true });
    }
  } catch (error) {
    next(error);
  }
}

router.post("/proxy/:destination_id", proxyMessageFunction);

module.exports = router;
