const express = require("express");
const router = express.Router();

const getCountriesListRouter = require("./get.countriesList");

router.use(getCountriesListRouter);

module.exports = router;
