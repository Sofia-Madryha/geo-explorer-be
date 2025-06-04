const matchingPairsRouter = require("express").Router();
const {
  getMatchingPairsByFilters,
} = require("../controllers/matchingPairs-controller");

matchingPairsRouter.get("/sub-categories", getMatchingPairsByFilters);

module.exports = matchingPairsRouter;
