const learningCard = require("../db/data/test-data/learning_cards");
const { selectLearningCards } = require("../models/learningCards-model");

exports.getLearningCards = (req, res, next) => {
  const { sub_category_id } = req.params;
  selectLearningCards(sub_category_id)
    .then((learningCards) => {
      if (learningCards.length === 0) {
        return res.status(404).json({ msg: "404 Not Found" });
      }
      res.status(200).json({ learningCards });
    })
    .catch(next);
};
