const { client, Api, API_HASH, API_ID } = require("./telegramClient");

async function sendCodeController({ phoneNumber }) {
  try {
    await client.connect();

    const result = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId: parseInt(API_ID),
        apiHash: API_HASH,
        settings: new Api.CodeSettings({
          allowFlashcall: true,
          currentNumber: true,
          allowAppHash: true,
          allowMissedCall: true,
          logoutTokens: [Buffer.from("")],
        }),
      })
    );

    return result;
  } catch (error) {
    return { error };
  }
}

module.exports = sendCodeController;
