const { selectMultiChoiceQA } = require("../models/multichoiceqa-model");

exports.getMultiChoiceQA = (req, res, next) => {
  const {category_id, continent, level} = req.query

  return selectMultiChoiceQA(category_id, continent, level)
  .then((result) => {
    res.status(200).send({ multichoice_qa: result })
  })
  .catch((err) => {
    next(err)
  })
};