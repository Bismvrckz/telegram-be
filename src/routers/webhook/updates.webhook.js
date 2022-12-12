const express = require("express");
const { users, messages } = require("../../../models");
const {
  error_alert,
  general_alert,
  new_message,
  new_customer,
  customer_left,
} = require("../../components/alerts");
const { update_front_end } = require("../../components/socket.io");
const router = express.Router();

async function updatesRecieverFunction(req, res, next) {
  try {
    if (req.body.my_chat_member) {
      const { my_chat_member } = req.body;
      const { status } = my_chat_member.new_chat_member;
      const { id, is_bot, first_name, username } = my_chat_member.from;

      if (status == "member") {
        new_customer();
        console.log(
          "\n<##################################################################################>",
          "\n<######################{ !!!!NEW MEMBERR, AMOGUS STONKS!!!! }######################>",
          "\n<##################################################################################>"
        );
        console.log(
          "\n<-------------{ Cari user udah ada atau engga }------------->\n"
        );
        const existed = await users.findOne({
          where: { user_id: id },
        });

        if (existed) {
          error_alert();
          console.log(
            `\n ###### ⚠️User ${username} already one of us, watchout for query miss⚠️\n`
          );
          return res.send();
        }

        console.log("\n<-------------{ Buat user baru }------------->\n");
        await users.create({
          user_id: id,
          is_bot,
          first_name,
          username,
        });

        console.log(`\n ###### 👹ONE OF US!!!!! ${username}👹\n`);

        update_front_end();

        // console.log("<===DEETS-START===>");
        // console.log(req.body);
        // console.log("<===DEETS-END===>");
        return res.send();
      }

      if (status == "kicked") {
        customer_left();
        console.log(
          "\n<##################################################################################>",
          "\n<######################{ LEFT MEMBERR, AMOGUS NOT STONKS :( }######################>",
          "\n<##################################################################################>"
        );
        console.log("\n<-------------{ Hapus user }------------->\n");
        await users.destroy({
          where: { user_id: id },
        });

        console.log("\n<-------------{ Hapus user message }------------->\n");
        await messages.destroy({
          where: { user_id: null },
        });

        console.log(`\n ###### Gooodbye 👋, member ${username} has left\n`);

        update_front_end();

        // console.log("<===DEETS-START===>");
        // console.log(req.body);
        // console.log("<===DEETS-END===>");
        return res.send();
      }
    }

    if (req.body.message) {
      const { message } = req.body;
      const { message_id, text, from } = message;
      const { id, username } = from;

      new_message();
      console.log(
        "\n<###############################################################>",
        "\n<######################{ You got mail~~~ }######################>",
        "\n<###############################################################>"
      );
      console.log(
        "\n<-------------{ Cari message udah ada atau engga }------------->\n"
      );
      const existed = await messages.findOne({ where: { message_id } });

      if (existed) {
        error_alert();
        console.log(
          `\n ###### ⚠️Message with id ${message_id} from ${username} already existed, watchout for query miss⚠️\n`
        );
        console.log("");
        return res.send();
      }

      console.log("\n<-------------{ Masukin database gan }------------->\n");
      await messages.create({
        user_id: id,
        message_id,
        is_bot: false,
        text,
      });

      console.log(`New message \"${text}\" from ${username}`);

      update_front_end();

      // console.log("<===DEETS-START===>");
      // console.log(req.body);
      // console.log("<===DEETS-END===>");
      return res.send();
    }

    if (req.body.edited_message) {
      const { message_id, text, from } = req.body.edited_message;
      const { username } = from;

      // await messages.update(
      //   {
      //     text,
      //   },
      //   {
      //     where: { message_id },
      //   }
      // );

      console.log(`Edited message \"${text}\" from ${username}`);

      return res.send();
    }

    return res.send();
  } catch (error) {
    next(error);
  }
}

router.post("/updates", updatesRecieverFunction);

module.exports = router;
