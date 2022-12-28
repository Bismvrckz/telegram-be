const TeleBot = require("telebot");
async function bot({ bot_token }) {
  return new TeleBot(bot_token);
}
module.exports = bot;
