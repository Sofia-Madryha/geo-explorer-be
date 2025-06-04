const db = require("../db/connection");
exports.selectMatchingPairsByFilters = (category_id, continent, level) => {
  const allowedContinents = [
    "asia",
    "europe",
    "africa",
    "south america",
    "north america",
    "oceania",
    "world",
  ];
  const allowedLevels = ["Beginner", "Intermediate", "Advanced"];

  const conditions = [];
  const queryValues = [];

  if (category_id) {
    conditions.push(`sub_categories.category_id = $${queryValues.length + 1}`);
    queryValues.push(category_id);
  }

  if (continent) {
    const continentLower = continent.toLowerCase();
    if (!allowedContinents.includes(continentLower)) {
      return Promise.reject({
        status: 400,
        msg: "400 Bad Request",
      });
    }
    if (continentLower !== "world") {
      conditions.push(
        `LOWER(questions_matching_pairs.continent) = $${queryValues.length + 1}`
      );
      queryValues.push(continentLower);
    }
  }

  if (level) {
    if (!allowedLevels.includes(level)) {
      return Promise.reject({
        status: 400,
        msg: "400 Bad Request",
      });
    }
    conditions.push(
      `questions_matching_pairs.level = $${queryValues.length + 1}`
    );
    queryValues.push(level);
  }

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  return db
    .query(
      `
      SELECT questions_matching_pairs.*, sub_categories.category_id
      FROM questions_matching_pairs
      JOIN sub_categories ON questions_matching_pairs.sub_category_id = sub_categories.sub_category_id
      ${whereClause}
      ORDER BY questions_matching_pairs.question_pairs_id;
      `,
      queryValues
    )
    .then(({ rows: questions }) => {
      if (questions.length === 0) return [];

      const questionIds = questions.map((q) => q.question_pairs_id);

      return db
        .query(
          `
          SELECT * 
          FROM answers_matching_pairs
          WHERE question_pairs_id = ANY($1)
          ORDER BY answer_pairs_id;
          `,
          [questionIds]
        )
        .then(({ rows: answers }) => {
          const answersByQuestionId = {};
          answers.forEach((answer) => {
            if (!answersByQuestionId[answer.question_pairs_id]) {
              answersByQuestionId[answer.question_pairs_id] = [];
            }
            answersByQuestionId[answer.question_pairs_id].push({
              answer_pairs_id: answer.answer_pairs_id,
              left_text: answer.left_text,
              right_text: answer.right_text,
            });
          });

          return questions.map((question) => ({
            ...question,
            answers: answersByQuestionId[question.question_pairs_id] || [],
          }));
        });
    });
};
