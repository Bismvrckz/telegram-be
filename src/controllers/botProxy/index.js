const { messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");

async function textProxy({ req, res, next, resForwardBot, fromBot }) {
  try {
    const { id, is_bot, first_name, username } = resForwardBot.forward_from;

    await messages.create({
      user_id: req.params.destination_id || resForwardBot.from.id,
      message_id: resForwardBot.message_id,
      messageType: "message",
      is_bot: fromBot,
      text: resForwardBot.text,
      forwarding_status: {
        id,
        is_bot,
        first_name,
        username,
      },
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

async function imageProxy({ req, res, next, resForwardBot, fromBot }) {
  try {
    const { id, is_bot, first_name, username } = resForwardBot.forward_from;
    const { photo } = resForwardBot;
    const { file_id } = photo[photo.length - 1];

    const { fileLink } = await bot.getFile(file_id);

    await messages.create({
      user_id: req.params.destination_id || resForwardBot.from.id,
      message_id: resForwardBot.message_id,
      messageType: "image",
      is_bot: fromBot,
      text: resForwardBot.text,
      forwarding_status: {
        id,
        is_bot,
        first_name,
        username,
      },
      file_url: fileLink,
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

async function documentProxy({ req, res, next, resForwardBot, fromBot }) {
  try {
    const { id, is_bot, first_name, username } = resForwardBot.forward_from;
    const { document } = resForwardBot;
    const { file_id } = document;

    const { fileLink } = await bot.getFile(file_id);

    await messages.create({
      user_id: req.params.destination_id || resForwardBot.from.id,
      message_id: resForwardBot.message_id,
      messageType: "document",
      is_bot: fromBot,
      text: resForwardBot.text,
      forwarding_status: {
        id,
        is_bot,
        first_name,
        username,
      },
      file_url: fileLink,
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

module.exports = { textProxy, imageProxy, documentProxy };
