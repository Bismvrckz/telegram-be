const express = require("express");
const { users, messages } = require("../../../models");
const router = express.Router();

async function getAllUsers(req, res, next) {
  try {
    const { session } = req.query;
    console.log(req.query);
    const userArray = await users.findAll({
      include: messages,
      order: [[messages, "updatedAt", "DESC"]],
    });

    res.send({
      status: "Success",
      httpCode: 200,
      userArray,
    });
  } catch (error) {
    next(error);
  }
}

router.get("/all", getAllUsers);

module.exports = router;
