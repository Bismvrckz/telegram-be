const express = require("express");
const sendCodeController = require("../../controllers/gramjs/sendCode");
const router = express.Router();

async function sendCodeFunction(req, res, next) {
  try {
    const { fixedNumber } = req.body;

    const resSendCodeController = await sendCodeController({
      phoneNumber: fixedNumber,
    });

    // const resSendCodeController = {
    //   CONSTRUCTOR_ID: 1577067778,
    //   SUBCLASS_OF_ID: 1827172481,
    //   className: "auth.SentCode",
    //   classType: "constructor",
    //   flags: 2,
    //   type: {
    //     CONSTRUCTOR_ID: 1035688326,
    //     SUBCLASS_OF_ID: 4284159374,
    //     className: "auth.SentCodeTypeApp",
    //     classType: "constructor",
    //     length: 5,
    //   },
    //   phoneCodeHash: "0d7ad86cedfd7e72f5",
    //   nextType: {
    //     CONSTRUCTOR_ID: 1923290508,
    //     SUBCLASS_OF_ID: 3019105281,
    //     className: "auth.CodeTypeSms",
    //     classType: "constructor",
    //   },
    //   timeout: null,
    // };

    console.log({ resSendCodeController });

    if (resSendCodeController.error) {
      throw resSendCodeController.error;
    }

    res.send({
      status: "Success",
      httpCode: 200,
      resSendCodeController,
    });
  } catch (error) {
    next(error);
  }
}

router.post("/sendCode", sendCodeFunction);

module.exports = router;
