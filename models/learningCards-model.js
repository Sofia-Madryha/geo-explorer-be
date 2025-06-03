const db = require("../db/connection");

exports.selectLearningCards = (sub_category_id) => {
  return db
    .query(
      `SELECT * FROM learning_cards
        WHERE sub_category_id=$1
        ORDER BY card_id;`,
      [sub_category_id]
    )
    .then((result) => result.rows);
};
