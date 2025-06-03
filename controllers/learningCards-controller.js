const { selectLearningCards } = require("../models/learningCards-model");

exports.getLearningCards = (req, res, next) => {
  const { sub_category_id } = req.params;

  if (!/^\d+$/.test(sub_category_id)) {
    return res.status(400).json({ msg: "400 Bad Request" });
  }
  selectLearningCards(sub_category_id)
    .then((learningCards) => {
      if (learningCards.length === 0) {
        return res.status(404).json({ msg: "404 Not Found" });
      }
      res.status(200).json({ learningCards });
    })
    .catch(next);
};
