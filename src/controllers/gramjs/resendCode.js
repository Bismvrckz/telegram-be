const { client, Api } = require("./telegramClient");

async function resendCodeController({ phoneNumber, phoneCodeHash }) {
  try {
    await client.connect();

    const result = await client.invoke(
      new Api.auth.ResendCode({
        phoneNumber,
        phoneCodeHash,
      })
    );

    return result;
  } catch (error) {
    return { error };
  }
}

module.exports = resendCodeController;
