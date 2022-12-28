const { messages } = require("../../../models");
const { error_alert, new_message } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");
const {
  imageProxy,
  documentProxy,
  textProxy,
} = require("../../controllers/botProxy");

async function newMessageUpdateFunction({
  req,
  res,
  next,
  bot_token,
  from_user_id,
}) {
  try {
    const { message } = req.body;
    const { message_id, text, from } = message;
    const { id, username } = from;

    new_message();
    const existed = await messages.findOne({
      where: { user_id: from_user_id, message_id },
    });

    if (existed) {
      console.log({ existed });
      error_alert();
      console.log(
        `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
      );
      return res.send();
    }

    await messages.create({
      user_id: from_user_id,
      user_message_id: message_id,
      messageType: "Message",
      is_bot: false,
      text,
    });

    console.log(`\nNew message \"${text}\" from ${username}\n`);

    update_front_end({ bot_token });
    return res.send();
  } catch (error) {
    next(error);
  }
}

async function newImageMessageFunction({
  res,
  next,
  message,
  bot_token,
  from_user_id,
}) {
  try {
    const { message_id, text, from } = message;
    const { id, username } = from;

    new_message();
    const existed = await messages.findOne({
      where: { user_id: from_user_id, message_id },
    });

    if (existed) {
      error_alert();
      console.log(
        `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
      );
      return res.send();
    }

    const { file_id } = message.photo[message.photo.length - 1];

    const newBot = await bot({ bot_token });
    const resGetFileTeleBot = await newBot.getFile(file_id);

    await messages.create({
      user_id: from_user_id,
      user_message_id: message_id,
      messageType: "Image",
      file_url: resGetFileTeleBot.fileLink,
      is_bot: false,
    });

    update_front_end({ bot_token });

    return res.send();
  } catch (error) {
    next(error);
  }
}

async function newDocumentMessageFunction({
  res,
  next,
  message,
  bot_token,
  from_user_id,
}) {
  try {
    const { message_id, from, document } = message;
    const { id, username } = from;

    new_message();

    const existed = await messages.findOne({
      where: { user_id: from_user_id, user_message_id: message_id },
    });

    if (existed) {
      error_alert();
      console.log(
        `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
      );
      return res.send();
    }

    const { file_id } = document;

    const newBot = await bot({ bot_token });
    const resGetFileTeleBot = await newBot.getFile(file_id);

    await messages.create({
      user_id: from_user_id,
      chat_id: id,
      user_message_id: message_id,
      messageType: "Document",
      file_url: resGetFileTeleBot.fileLink,
      is_bot: false,
    });

    update_front_end({ bot_token });

    return res.send();
  } catch (error) {
    next(error);
  }
}

async function proxyMessageFunction({
  req,
  res,
  next,
  message,
  bot_token,
  from_user_id,
}) {
  try {
    new_message();

    if (message.photo) {
      return imageProxy({
        req,
        res,
        next,
        bot_token,
        from_user_id,
        fromBot: false,
        resForwardBot: message,
      });
    } else if (message.document) {
      return documentProxy({
        req,
        res,
        next,
        bot_token,
        from_user_id,
        fromBot: false,
        resForwardBot: message,
      });
    } else {
      return textProxy({
        req,
        res,
        next,
        bot_token,
        from_user_id,
        fromBot: false,
        resForwardBot: message,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  newMessageUpdateFunction,
  newImageMessageFunction,
  newDocumentMessageFunction,
  proxyMessageFunction,
};
