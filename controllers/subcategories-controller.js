const { selectSubCategories } = require("../models/subcategories-model");

exports.getSubCategories = (req, res) => {
  return selectSubCategories().then((result) => {
    res.status(200).send({ subcategories: result });
  });
};
