const db = require("../db/connection");

exports.selectMatchingPairsByFilters = (category_id, continent, level) => {
  // 1: Define allowed values for green-listing
  const allowedContinents = [
    "asia",
    "europe",
    "africa",
    "south america",
    "north america",
    "oceania",
    "world", // Use 'world' instead of 'global'
  ];
  const allowedLevels = ["Beginner", "Intermediate", "Advanced"];

  // 2: Prepare dynamic conditions and values for parameterized SQL query
  const conditions = [];
  const queryValues = [];

  // 3: Add condition for category_id if provided
  if (category_id) {
    conditions.push(`category_id = $${queryValues.length + 1}`);
    queryValues.push(category_id);
  }

  // 4: Validate and add condition for continent if provided
  if (continent) {
    const cLower = continent.toLowerCase();

    // Reject if continent not in green list
    if (!allowedContinents.includes(cLower)) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: invalid continent",
      });
    }

    // If continent is not 'world', add continent filter condition
    if (cLower !== "world") {
      conditions.push(`LOWER(continent) = $${queryValues.length + 1}`);
      queryValues.push(cLower);
    }
  }

  // 5: Validate and add condition for level if provided
  if (level) {
    if (!allowedLevels.includes(level)) {
      return Promise.reject({
        status: 400,
        msg: "Bad Request: invalid level",
      });
    }
    conditions.push(`level = $${queryValues.length + 1}`);
    queryValues.push(level);
  }

  // 6: Construct WHERE clause if any conditions exist
  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  // 7: Query to select matching pairs questions filtered by category, continent, level
  return db
    .query(
      `
      SELECT * 
      FROM questions_matching_pairs q
      JOIN sub_categories sc ON q.sub_category_id = sc.sub_category_id
      ${whereClause}
      ORDER BY q.question_pairs_id;
      `,
      queryValues
    )
    .then(({ rows: questions }) => {
      // 8: Return empty array if no questions found
      if (questions.length === 0) return [];

      // 9: Extract all question_pairs_id to fetch matching answers
      const questionIds = questions.map((q) => q.question_pairs_id);

      // 10: Query all answers for the found question IDs
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
          // Step 11: Group answers by their question_pairs_id
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

          // 12: Combine answers array into corresponding question object
          return questions.map((question) => ({
            ...question,
            answers: answersByQuestionId[question.question_pairs_id] || [],
          }));
        });
    });
};
