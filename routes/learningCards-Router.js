const { getLearningCards } = require("../controllers/learningCards-controller");

const learningCardsRouter = require("express").Router();

learningCardsRouter.get("/", getLearningCards);

module.exports = learningCardsRouter;
