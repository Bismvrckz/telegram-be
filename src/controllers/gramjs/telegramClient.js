const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
require("dotenv").config();

const { API_HASH, API_ID } = process.env;

const session = new StringSession("");
const client = new TelegramClient(session, parseInt(API_ID), API_HASH, {});

module.exports = { Api, client, API_HASH, API_ID };
