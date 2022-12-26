const express = require("express");
const router = express.Router();
const { webhookRouterToken } = require("../../components/createToken");
const { initWebhook } = require("../../controllers/initWebhook");

async function botWebhookTokenFunction(req, res, next) {
  try {
    const { serverUrl, botToken } = req.body;
    const botWebhookToken = await webhookRouterToken();

    const resInit = await initWebhook({ botToken, serverUrl, botWebhookToken });

    if (resInit.error) {
      console.log("Error");
      res.send({
        status: "Error",
        detail: resInit.error.response.data,
      });
    }

    res.send({
      status: "Success",
      httpCode: 200,
      resInit,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/init", botWebhookTokenFunction);

module.exports = router;
