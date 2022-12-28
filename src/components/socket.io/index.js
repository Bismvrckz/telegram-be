const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { front_end_updated } = require("../alerts");
const { users, messages } = require("./../../../models");
const app = express();
require("dotenv").config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const update_front_end = async ({ bot_token }) => {
  front_end_updated();

  const updated_user = await users.findAll({
    where: { bot_token },
    include: messages,
    order: [[messages, "updatedAt", "DESC"]],
  });

  io.emit(`update_new:${bot_token}`, { updated_user });
};

module.exports = { io, server, update_front_end, app, express };
