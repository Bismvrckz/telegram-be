const { telegramClientFunction, Api } = require("./telegramClient");

async function getALlChatsController({ stringSession }) {
  const client = telegramClientFunction({ stringSession });

  await client.connect();

  const result = await client.invoke(
    new Api.messages.GetCommonChats({
      userId: "5743616739n",
      maxId: 0,
      limit: 100,
    })
  );

  return result;
}

module.exports = getALlChatsController;
