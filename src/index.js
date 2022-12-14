const axios = require("axios");
const cors = require("cors");
const { server, app, express } = require("./components/socket.io");
require("dotenv").config();

const countriesListRouter = require("./routers/countriesList");
const phoneCodeRouter = require("./routers/sendCode");
const signInRouter = require("./routers/signIn");
const webhookRouter = require("./routers/webhook");
const usersRouter = require("./routers/users");
const messagesRouter = require("./routers/messages");

const PORT = process.env.CUSTOM_PORT || 8000;
const { TOKEN, SERVER_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI + "/updates";

async function init() {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
}

app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/countriesList", countriesListRouter);
app.use("/phoneCode", phoneCodeRouter);
app.use("/messages", messagesRouter);
app.use("/signIn", signInRouter);
app.use("/users", usersRouter);
app.use(URI, webhookRouter);

app.use("/public", express.static("public"));

app.use((error, req, res, next) => {
  error.response ? console.log(error.response.data) : console.log({ error });

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
    console.log(`APP RUNNING at ${PORT} ✅`);
    await init();
  }
});
