const cors = require("cors");
const { server, app, express } = require("./components/socket.io");
const { bots } = require("../models");
const botTokenRouter = require("./routers/botToken");
const webhookRouter = require("./routers/webhook");
const usersRouter = require("./routers/users");
const messagesRouter = require("./routers/messages");
require("dotenv").config();

(async () => {
  const botsArray = await bots.findAll();
  const PORT = process.env.CUSTOM_PORT || 8000;

  app.use(cors());
  app.use(express.json());
  app.use("/public", express.static("public"));
  app.use("/messages", messagesRouter);
  app.use("/botToken", botTokenRouter);
  app.use("/users", usersRouter);

  if (botsArray.length) {
    botsArray.map(async ({ dataValues }) => {
      const { bot_token } = dataValues;
      const URI = `/webhook/${bot_token}`;
      app.use(URI, webhookRouter);
    });
    console.log({ bots: botsArray.length });
  }

  app.use("/public", express.static("public"));

  app.use((error, req, res, next) => {
    error.response ? console.log(error.response.data) : console.log({ error });
    error.errorMessage ? "" : (error.errorMessage = error.message);

    const errorObj = {
      status: "Error",
      message: error.errorMessage,
      detail: error,
    };

    const httpCode = typeof error.code == "number" ? error.code : 500;
    res.status(httpCode).send(errorObj);
  });

  server.listen(PORT, async (error) => {
    if (error) {
      console.log(`ERROR: ${error}`);
    } else {
      console.log(`SERVER RUNNING at ${PORT} ✅`);
    }
  });
})();
