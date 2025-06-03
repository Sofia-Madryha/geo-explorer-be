const { getSubCategories } = require("../controllers/subcategories-controller");

const subCategoriesRouter = require("express").Router();

subCategoriesRouter.get("/", getSubCategories);

module.exports = subCategoriesRouter;
