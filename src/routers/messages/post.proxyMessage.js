const express = require("express");
const { message_sent } = require("../../components/alerts");
const bot = require("../../components/telebot");
const {
  textProxy,
  imageProxy,
  documentProxy,
} = require("../../controllers/botProxy");
const router = express.Router();
const { users } = require("../../../models");

async function proxyMessageFunction(req, res, next) {
  try {
    const { from, message_id, to } = req.body;
    const { bot_token } = req.query;

    const destination_id = (await users.findOne({ where: { user_id: to } }))
      .dataValues.chat_id;
    const from_id = (await users.findOne({ where: { user_id: from } }))
      .dataValues.chat_id;

    console.log({
      from,
      to,
      from_id,
      destination_id,
      message_id,
      bot_token,
    });

    const newBot = await bot({ bot_token });

    const resForwardBot = await newBot.forwardMessage(
      destination_id,
      from_id,
      parseInt(message_id)
    );

    message_sent();

    if (resForwardBot.photo) {
      return imageProxy({
        req,
        res,
        next,
        bot_token,
        resForwardBot,
        fromBot: true,
        from_user_id: to,
      });
    } else if (resForwardBot.document) {
      return documentProxy({
        req,
        res,
        next,
        bot_token,
        resForwardBot,
        fromBot: true,
        from_user_id: to,
      });
    } else {
      return textProxy({
        req,
        res,
        next,
        bot_token,
        resForwardBot,
        fromBot: true,
        from_user_id: to,
      });
    }
  } catch (error) {
    next(error);
  }
}

router.post("/proxy/", proxyMessageFunction);

module.exports = router;
