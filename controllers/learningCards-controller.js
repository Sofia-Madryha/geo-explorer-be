const {
  selectLearningCardsByFilters,
} = require("../models/learningCards-model");

exports.getLearningCards = (req, res, next) => {
  const { sub_category_id, continent, page } = req.query;

  const pageNum = page ? parseInt(page, 10) : 1;

  const limit = 10;

  const offset = (pageNum - 1) * limit;

  selectLearningCardsByFilters(sub_category_id, continent, offset, limit)
    .then((cards) => {
      if (cards.length === 0) {
        return res.status(404).json({ msg: "404 Not Found" });
      }
      res.status(200).json({ learningCards: cards });
    })
    .catch((err) => {
      if (err.status && err.msg) {
        res.status(err.status).json({ msg: err.msg });
      } else {
        next(err);
      }
    });
};
