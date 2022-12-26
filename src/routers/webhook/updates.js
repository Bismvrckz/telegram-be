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
const router = express.Router();

async function updatesRecieverFunction(req, res, next) {
  try {
    console.log(req.body);
    const { my_chat_member, message, edited_message } = req.body;

    if (my_chat_member) {
      const { status } = my_chat_member.new_chat_member;

      if (status == "member") {
        return newMemberUpdateFunction({ req, res, next });
      }

      if (status == "kicked") {
        return leftMemberUpdateFunction({ req, res, next });
      }
    }

    if (message) {
      if (message.forward_from) {
        return proxyMessageFunction({ req, res, next, message });
      }

      if (message.photo) {
        return newImageMessageFunction({ req, res, next, message });
      }

      if (message.document) {
        return newDocumentMessageFunction({ req, res, next, message });
      }

      newMessageUpdateFunction({ req, res, next });
    }

    return res.send();
  } catch (error) {
    next(error);
  }
}

router.post("/updates", updatesRecieverFunction);

module.exports = router;
