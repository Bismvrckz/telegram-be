const { Api, client } = require("./telegramClient");

async function getCountriesListController() {
  try {
    await client.connect();

    const resGetCountries = await client.invoke(
      new Api.help.GetCountriesList({
        langCode: "javascript",
        hash: 0,
      })
    );

    return resGetCountries;
  } catch (error) {
    return { error };
  }
}

module.exports = getCountriesListController;
