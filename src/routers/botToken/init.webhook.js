const express = require("express");
const router = express.Router();
const path = require("path");
const appRoot = require("app-root-path");
const fs = require("fs");
const { bots } = require("../../../models");
const { default: axios } = require("axios");
require("dotenv").config();

async function signInFunction(req, res, next) {
  try {
    const { bot_token } = req.body;
    const { SERVER_URL } = process.env;
    const dateStamp = new Date();

    const alreadyExist = await bots.findOne({ where: { bot_token } });

    if (alreadyExist) {
      alreadyExist.update({ bot_token });
      return res.send({
        status: "Success",
        httpCode: 200,
      });
    }

    const TELEGRAM_API = `https://api.telegram.org/bot${bot_token}`;
    const URI = `/webhook/${bot_token}`;
    const WEBHOOK_URL = SERVER_URL + URI + "/updates";
    const resSetWebhook = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
    );
    if (!resSetWebhook.data.ok) throw new Error(resSetWebhook.data.description);

    await bots.create({ bot_token });

    fs.chmodSync(path.join(appRoot.path, "log.txt"), 0o666);
    fs.appendFileSync(
      path.join(appRoot.path, "log.txt"),
      `\nTOKEN="${bot_token}"\nSERVER_URL="${SERVER_URL}"\nDATE="${dateStamp}"\n`,
      "utf-8"
    );

    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    if (error.response.data.description == "Unauthorized") {
      res.send({
        status: "Error",
        detail: error.response.data,
      });
      return;
    }
    next(error);
  }
}

router.post("/init", signInFunction);

module.exports = router;
