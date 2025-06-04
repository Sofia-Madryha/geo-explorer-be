const {
  selectMatchingPairsByFilters,
} = require("../models/matchingPairs-model");

exports.getMatchingPairs = (req, res, next) => {
  const { category_id, continent, level } = req.query;

  selectMatchingPairsByFilters(category_id, continent, level)
    .then((matchingPairs) => {
      if (matchingPairs.length === 0) {
        return res.status(404).json({ msg: "404 Not Found" });
      }
      res.status(200).json({ matchingPairs });
    })
    .catch((err) => {
      if (err.status && err.msg) {
        return res.status(err.status).json({ msg: err.msg });
      }
      next(err);
    });
};
