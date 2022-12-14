const { users, messages } = require("../../../models");
const { update_front_end } = require("../../components/socket.io");
const {
  error_alert,
  new_customer,
  customer_left,
} = require("../../components/alerts");

async function newMemberUpdateFunction({ req, res, next }) {
  try {
    const { my_chat_member } = req.body;
    const { status } = my_chat_member.new_chat_member;
    const { id, is_bot, first_name, username } = my_chat_member.from;

    new_customer();
    const existed = await users.findOne({
      where: { user_id: id },
    });

    if (existed) {
      error_alert();
      return res.send();
    }

    await users.create({
      user_id: id,
      is_bot,
      first_name,
      username,
    });

    console.log(`\n ###### 👹ONE OF US!!!!! ${username}👹\n`);

    update_front_end();

    return res.send();
  } catch (error) {
    return { error };
  }
}

async function leftMemberUpdateFunction({ req, res, next }) {
  try {
    const { my_chat_member } = req.body;
    const { status } = my_chat_member.new_chat_member;
    const { id, is_bot, first_name, username } = my_chat_member.from;

    customer_left();
    await users.destroy({
      where: { user_id: id },
    });

    await messages.destroy({
      where: { user_id: null },
    });

    console.log(`\n ###### Gooodbye 👋, member ${username} has left\n`);

    update_front_end();
    return res.send();
  } catch (error) {
    next(error);
  }
}

module.exports = { newMemberUpdateFunction, leftMemberUpdateFunction };
