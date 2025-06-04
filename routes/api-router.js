const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");
const usersRouter = require("./users-router");

const learningCardsRouter = require("./learningCards-Router");

const multiChoiceQARouter = require("./multichoice-qa-router");
const subCategoriesRouter = require("./subcategories-router");
const matchingPairsRouter = require("./matchingPairs-router");

const apiRouter = require("express").Router();

//Routes
apiRouter.get("/", getApi);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);

apiRouter.use("/learning-cards", learningCardsRouter);

apiRouter.use("/subcategories", subCategoriesRouter);
apiRouter.use("/multichoice-qa", multiChoiceQARouter);
apiRouter.use("/matching-pairs", matchingPairsRouter);

module.exports = apiRouter;
