const express = require("express");
const router = express.Router();
const getCountriesListController = require("../../controllers/gramjs/getCountriesList");

async function getCountriesListFunction(req, res, next) {
  try {
    const { countries } = await getCountriesListController();

    res.send({
      status: "Success",
      httpCode: 200,
      countries,
    });
  } catch (error) {
    next(error);
  }
}

router.get("/all", getCountriesListFunction);

module.exports = router;
