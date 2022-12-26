async function bot({ botToken }) {
  try {
    const TeleBot = require("telebot");

    return new TeleBot(botToken);
  } catch (error) {
    console.log({ error });
  }
}

module.exports = bot;
