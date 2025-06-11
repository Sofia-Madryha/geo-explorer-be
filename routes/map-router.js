const { getMapQuestions } = require("../controllers/map-controller");

const express = require("express");
const mapRouter = express.Router();

mapRouter.get("/", getMapQuestions);

module.exports = mapRouter;
