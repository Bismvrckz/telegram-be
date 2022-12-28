const express = require("express");
const router = express.Router();
const path = require("path");
const appRoot = require("app-root-path");
const fs = require("fs");
const { bots } = require("../../../models");
const telebot = require("telebot");

async function signInFunction(req, res, next) {
  try {
    const { bot_token, server_url } = req.body;
    const dateStamp = new Date();

    const alreadyExist = await bots.findOne({ where: { bot_token } });

    fs.chmodSync(path.join(appRoot.path, "log.txt"), 0o666);
    fs.appendFileSync(
      path.join(appRoot.path, "log.txt"),
      `\nTOKEN="${bot_token}"\nSERVER_URL="${server_url}"\nDATE="${dateStamp}"\n`,
      "utf-8"
    );

    if (alreadyExist) {
      alreadyExist.update({ bot_token, server_url });
      return res.send({
        status: "Success",
        httpCode: 200,
      });
    }

    new telebot(bot_token);
    await bots.create({ bot_token, server_url });

    res.send({
      status: "Success",
      httpCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/init", signInFunction);

module.exports = router;
