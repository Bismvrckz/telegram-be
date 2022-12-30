const { messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");

async function textProxy({
  req,
  res,
  next,
  fromBot,
  bot_token,
  from_user_id,
  resForwardBot,
}) {
  try {
    const { id, is_bot, first_name, username } = resForwardBot.forward_from;

    const resCreateMessage = await messages.create({
      user_id: from_user_id,
      chat_id: req.params.destination_id || resForwardBot.from.id,
      user_message_id: resForwardBot.message_id,
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

    update_front_end({ bot_token });

    res.send({
      status: "Success",
      httpCode: 200,
      resCreateMessage,
    });
  } catch (error) {
    next(error);
  }
}

async function imageProxy({
  req,
  res,
  next,
  fromBot,
  bot_token,
  from_user_id,
  resForwardBot,
}) {
  try {
    const { id, is_bot, first_name, username } = resForwardBot.forward_from;
    const { photo } = resForwardBot;
    const { file_id } = photo[photo.length - 1];

    const newBot = await bot({ bot_token });
    const { fileLink } = await newBot.getFile(file_id);

    const resCreateMessage = await messages.create({
      user_id: from_user_id,
      chat_id: req.params.destination_id || resForwardBot.from.id,
      user_message_id: resForwardBot.message_id,
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

    update_front_end({ bot_token });

    res.send({
      status: "Success",
      httpCode: 200,
      resCreateMessage,
    });
  } catch (error) {
    next(error);
  }
}

async function documentProxy({
  req,
  res,
  next,
  resForwardBot,
  fromBot,
  bot_token,
  from_user_id,
}) {
  try {
    const { id, is_bot, first_name, username } = resForwardBot.forward_from;
    const { document } = resForwardBot;
    const { file_id } = document;

    const newBot = await bot({ bot_token });
    const { fileLink } = await newBot.getFile(file_id);

    const resCreateMessage = await messages.create({
      user_id: from_user_id,
      chat_id: req.params.destination_id || resForwardBot.from.id,
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

    update_front_end({ bot_token });

    res.send({
      status: "Success",
      httpCode: 200,
      resCreateMessage,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { textProxy, imageProxy, documentProxy };
