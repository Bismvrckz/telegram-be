const express = require("express");
const signInController = require("../../controllers/gramjs/signIn");
const router = express.Router();

async function signInFunction(req, res, next) {
  try {
    const { phoneNumber, phoneCodeHash, phoneCode } = req.body;

    const resSignIn = await signInController({
      phoneNumber,
      phoneCodeHash,
      phoneCode,
    });

    console.log({ resSignIn });

    if (resSignIn.error) {
      console.log("Error");
      throw resSignIn.error;
    }

    res.send({
      status: "Success",
      httpCode: 200,
      user: resSignIn,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/withPhoneCode", signInFunction);

module.exports = router;
