const { default: axios } = require("axios");

require("dotenv").config();

async function initWebhook({ botToken, serverUrl, botWebhookToken }) {
  try {
    const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;
    const URI = `/webhook/${botWebhookToken}`;
    const WEBHOOK_URL = serverUrl + URI + "/updates";

    const res = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
    );

    return res.data;
  } catch (error) {
    return { error };
  }
}

module.exports = { initWebhook };
