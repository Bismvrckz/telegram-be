const TeleBot = require("telebot");
require("dotenv").config();

const { TOKEN } = process.env;

const bot = new TeleBot(TOKEN);

module.exports = bot;
