const { getMatchingPairs } = require("../controllers/matchingPairs-controller");
const express = require("express");

const matchingPairsRouter = express.Router();

matchingPairsRouter.get("/", getMatchingPairs);

module.exports = matchingPairsRouter;
