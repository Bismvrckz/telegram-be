const express = require("express");
const cors = require("cors");
const app = express();

const countriesListRouter = require("./routers/countriesList");
const messagesRouter = require("./routers/messages");
const phoneCodeRouter = require("./routers/sendCode");
const signInRouter = require("./routers/signIn");

const PORT = process.env.CUSTOM_PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/countriesList", countriesListRouter);
app.use("/phoneCode", phoneCodeRouter);
app.use("/messages", messagesRouter);
app.use("/signIn", signInRouter);

app.use((error, req, res, next) => {
  console.log({ error });

  const errorObj = {
    status: "Error",
    message: error.errorMessage,
    detail: error,
  };

  const httpCode = typeof error.code == "number" ? error.code : 500;
  res.status(httpCode).send(errorObj);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
