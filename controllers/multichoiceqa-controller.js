const { selectMultiChoiceQA } = require("../models/multichoiceqa-model");

exports.getMultiChoiceQA = (req, res) => {
  return selectMultiChoiceQA().then((result) => {
    res.status(200).send({ multichoice_qa: result });
  });
};
