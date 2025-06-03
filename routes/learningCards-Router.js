const { getLearningCards } = require("../controllers/learningCards-controller");

const learningCardsRouter = require("express").Router();

learningCardsRouter.get("/sub-categories/:sub_category_id", getLearningCards);

module.exports = learningCardsRouter;
