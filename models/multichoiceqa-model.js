const db = require("../db/connection");

exports.selectMultiChoiceQA = () => {
  return db
    .query(
      `SELECT * FROM questions_multiple_choices q
LEFT JOIN answers_multiple_choices a
ON q.question_mc_id = a.question_mc_id`
    )
    .then((result) => {
      console.log(result.rows, "<<<<<<query");
      return result.rows;
    });
};
