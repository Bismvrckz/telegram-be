const express = require("express");
const { initWebhook } = require("../../controllers/initWebhook");
const router = express.Router();

async function signInFunction(req, res, next) {
  try {
    const { serverUrl, botToken } = req.body;

    const resInit = await initWebhook({ botToken, serverUrl });

    if (resInit.error) {
      console.log("Error");
      res.send({
        status: "Error",
        detail: resInit.error.response.data,
      });
    }

    console.log({ resInit });

    res.send({
      status: "Success",
      httpCode: 200,
      resInit,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/init", signInFunction);

module.exports = router;
