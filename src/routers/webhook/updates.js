const express = require("express");
const {
  newMemberUpdateFunction,
  leftMemberUpdateFunction,
} = require("./updates.members");
const {
  newMessageUpdateFunction,
  newImageMessageFunction,
  newDocumentMessageFunction,
  proxyMessageFunction,
} = require("./updates.messages");
const { users } = require("../../../models");
const router = express.Router();

async function updatesRecieverFunction(req, res, next) {
  try {
    const { my_chat_member, message } = req.body;
    const { baseUrl } = req;
    const split_url = baseUrl.split("/");
    const bot_token = split_url[split_url.length - 1];
    console.log({ bot_token });

    if (my_chat_member) {
      const { status } = my_chat_member.new_chat_member;

      if (status == "member") {
        return newMemberUpdateFunction({ req, res, next, bot_token });
      }

      if (status == "kicked") {
        return leftMemberUpdateFunction({ req, res, next, bot_token });
      }
    }

    if (message) {
      const from_user_id = (
        await users.findOne({
          where: { bot_token, chat_id: `${message.from.id}` },
        })
      )?.dataValues.user_id;

      if (message.forward_from) {
        return proxyMessageFunction({
          req,
          res,
          next,
          message,
          bot_token,
          from_user_id,
        });
      }

      if (message.photo) {
        return newImageMessageFunction({
          res,
          next,
          message,
          bot_token,
          from_user_id,
        });
      }

      if (message.document) {
        return newDocumentMessageFunction({
          res,
          next,
          message,
          bot_token,
          from_user_id,
        });
      }

      newMessageUpdateFunction({ req, res, next, bot_token, from_user_id });
    }

    return res.send();
  } catch (error) {
    next(error);
  }
}

router.post("/updates", updatesRecieverFunction);

module.exports = router;
