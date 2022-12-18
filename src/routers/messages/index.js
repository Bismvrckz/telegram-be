const express = require("express");
const router = express.Router();

const postMessage = require("./post.message");
const proxyMessage = require("./post.proxyMessage");
const postImageMessage = require("./post.imageMessage");
const postDocumentMessage = require("./post.documentMessage");

router.use(postMessage);
router.use(proxyMessage);
router.use(postImageMessage);
router.use(postDocumentMessage);

module.exports = router;
