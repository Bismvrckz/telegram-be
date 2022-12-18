const { messages } = require("../../../models");
const { error_alert, new_message } = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const bot = require("../../components/telebot");

async function newMessageUpdateFunction({ req, res, next }) {
  try {
    const { message } = req.body;
    const { message_id, text, from } = message;
    const { id, username } = from;

    new_message();
    const existed = await messages.findOne({ where: { message_id } });

    if (existed) {
      error_alert();
      console.log(
        `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
      );
      console.log("");
      return res.send();
    }

    await messages.create({
      user_id: id,
      message_id,
      messageType: "Message",
      is_bot: false,
      text,
    });

    console.log(`\nNew message \"${text}\" from ${username}\n`);

    update_front_end();
    return res.send();
  } catch (error) {
    next(error);
  }
}

async function newImageMessageFunction({ req, res, next, message }) {
  try {
    const { message_id, text, from } = message;
    const { id, username } = from;

    new_message();
    const existed = await messages.findOne({ where: { message_id } });

    if (existed) {
      error_alert();
      console.log(
        `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
      );
      return res.send();
    }

    const { file_id } = message.photo[message.photo.length - 1];

    const resGetFileTeleBot = await bot.getFile(file_id);

    await messages.create({
      user_id: id,
      message_id,
      messageType: "Image",
      file_url: resGetFileTeleBot.fileLink,
      is_bot: false,
    });

    update_front_end();

    return res.send();
  } catch (error) {
    next(error);
  }
}

async function newDocumentMessageFunction({ req, res, next, message }) {
  try {
    const { message_id, from, document } = message;
    const { id, username } = from;

    new_message();

    const existed = await messages.findOne({ where: { message_id } });

    if (existed) {
      error_alert();
      console.log(
        `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
      );
      return res.send();
    }

    const resGetFileTeleBot = await bot.getFile(document.file_id);

    await messages.create({
      user_id: id,
      message_id,
      messageType: "Document",
      file_url: resGetFileTeleBot.fileLink,
      is_bot: false,
    });

    update_front_end();

    return res.send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  newMessageUpdateFunction,
  newImageMessageFunction,
  newDocumentMessageFunction,
};
