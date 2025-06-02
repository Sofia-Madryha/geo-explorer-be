const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");

//Routes
apiRouter.get("/", getApi);
apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
