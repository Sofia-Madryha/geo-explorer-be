const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");
const learningCardsRouter = require("./learningCards-Router");

const apiRouter = require("express").Router();

//Routes
apiRouter.get("/", getApi);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/learning-cards", learningCardsRouter);

module.exports = apiRouter;
