const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");

const apiRouter = require("express").Router();

//Routes
apiRouter.get("/", getApi);
apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
