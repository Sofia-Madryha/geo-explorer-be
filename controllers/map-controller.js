const { selectMapByFilters } = require("../models/map-model");

exports.getMapQuestions = (req, res, next) => {
  const { category_id, continent, level } = req.query;

  selectMapByFilters(category_id, continent, level)
    .then((mapQuestions) => {
      if (mapQuestions.length === 0) {
        return res.status(404).json({ msg: "404 Not Found" });
      }
      res.status(200).json({ mapQuestions });
    })
    .catch((err) => {
      if (err.status && err.msg) {
        return res.status(err.status).json({ msg: err.msg });
      }
      next(err);
    });
};
