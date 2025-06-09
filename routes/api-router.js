const { getApi } = require("../controllers/api-controller");
const {
  categoriesRouter,
  usersRouter,
  learningCardsRouter,
  subCategoriesRouter,
  multiChoiceQARouter,
  matchingPairsRouter,
} = require("./index-router");

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
