const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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

const update_front_end = async () => {
  console.log(
    "\n<-------------{ Update data terbaru ke front-end }------------->\n"
  );
  console.log("\n <<update_front_end jalan>> \n");

  const updated_user = await users.findAll({
    include: messages,
    order: [[messages, "updatedAt", "DESC"]],
  });

  //   console.log(updated_user[0].messages);

  io.emit("update_new", { updated_user });
};

module.exports = { io, server, update_front_end, app, express };
