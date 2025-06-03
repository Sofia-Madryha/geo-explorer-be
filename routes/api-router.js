const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");
const multiChoiceQARouter = require("./multichoice-qa-router");
const subCategoriesRouter = require("./subcategories-router");

const apiRouter = require("express").Router();

//Routes
apiRouter.get("/", getApi);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/subcategories", subCategoriesRouter);
apiRouter.use("/multichoice-qa", multiChoiceQARouter);

module.exports = apiRouter;
