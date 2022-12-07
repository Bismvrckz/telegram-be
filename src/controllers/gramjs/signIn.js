const { client, Api } = require("./telegramClient");

async function signInController({ phoneNumber, phoneCodeHash, phoneCode }) {
  try {
    await client.connect();

    const result = await client.invoke(
      new Api.auth.SignIn({
        phoneCode,
        phoneNumber,
        phoneCodeHash,
      })
    );

    const savedSession = client.session.save();

    return { userDetail: result.user, savedSession };
  } catch (error) {
    return { error };
  }
}

module.exports = signInController;
