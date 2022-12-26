const TeleBot = require("telebot");
require("dotenv").config();

const { TOKEN } = process.env;

let bot;
if (TOKEN) {
  bot = new TeleBot(TOKEN);
  console.log("Bot is running");
} else bot = "";

module.exports = bot;
