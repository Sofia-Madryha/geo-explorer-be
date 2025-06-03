const { getApi } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

//Routes
apiRouter.get("/", getApi);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
