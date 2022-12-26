const { tokens } = require("../../../models/");
const randomToken = require("random-token");

async function webhookRouterToken() {
  try {
    const token = await tokens.findAll();

    if (!token.length) {
      const newToken = randomToken(15);

      resCreateNewToken = await tokens.create({
        webhookToken: newToken,
      });

      console.log("New token created");
      return [resCreateNewToken];
    }

    console.log("Token already exist");
    return token;
  } catch (error) {
    console.log({ error });
  }
}

module.exports = { webhookRouterToken };
