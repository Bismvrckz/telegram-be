const express = require("express");
const getALlChatsController = require("../../controllers/gramjs/getAllChats");
const router = express.Router();

async function getALlChatsFunction(req, res, next) {
  try {
    const { savedSession } = req.query;
    // let resGetAllChats = await getALlChatsController({
    //   stringSession: savedSession,
    // });

    // console.log(resGetAllChats);

    // resGetAllChats = resGetAllChats.filter((element) => {
    //   return element != 0;
    // });

    // resGetAllChats.users.forEach((chat) => {
    //   const { id } = chat;
    //   console.log(id.value);
    // });

    // console.log(resGetAllChats.users.length);

    res.send({
      status: "Success",
      httpCode: 200,
      // resGetAllChats,
    });
  } catch (error) {
    next(error);
  }
}

router.get("/allChats", getALlChatsFunction);

module.exports = router;
