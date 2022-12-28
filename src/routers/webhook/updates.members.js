const { users, messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const {
  error_alert,
  new_customer,
  customer_left,
} = require("../../components/alerts");

async function newMemberUpdateFunction({ req, res, next, bot_token }) {
  try {
    const { my_chat_member } = req.body;
    const { id, is_bot, first_name, username } = my_chat_member.from;

    new_customer();
    const existed = await users.findOne({
      where: { chat_id: id, bot_token },
    });

    console.log(`\n ###### 👹ONE OF US!!!!! ${username}👹\n`);

    if (existed) {
      console.log({ existed });
      update_front_end({ bot_token });
      return res.send();
    }

    await users.create({
      chat_id: id,
      is_bot,
      bot_token,
      first_name,
      username,
    });

    update_front_end({ bot_token });
    return res.send();
  } catch (error) {
    next(error);
  }
}

async function leftMemberUpdateFunction({ req, res, next, bot_token }) {
  try {
    const { my_chat_member } = req.body;
    const { id, username } = my_chat_member.from;

    customer_left();
    console.log(`\n ###### Gooodbye 👋, member ${username} has left\n`);

    await users.destroy({
      where: { chat_id: id, bot_token },
      force: true,
    });

    await messages.destroy({
      where: { user_id: null },
      force: true,
    });

    update_front_end({ bot_token });
    return res.send();
  } catch (error) {
    next(error);
  }
}

module.exports = { newMemberUpdateFunction, leftMemberUpdateFunction };
