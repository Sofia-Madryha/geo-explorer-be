const db = require("../db/connection");

exports.selectLearningCardsByFilters = (
  sub_category_id,
  continent,
  offset = 0,
  limit = 5
) => {
  const allowedContinents = [
    "asia",
    "europe",
    "africa",
    "south america",
    "north america",
    "oceania",
    "world",
  ];

  const conditions = [];
  const queryValues = [];

  if (sub_category_id) {
    conditions.push(`sub_category_id = $${queryValues.length + 1}`);
    queryValues.push(sub_category_id);
  }

  if (continent) {
    const continentLower = continent.toLowerCase();
    if (continentLower !== "world") {
      if (!allowedContinents.includes(continentLower)) {
        return Promise.reject({ status: 400, msg: "400 Bad Request" });
      }
      conditions.push(`LOWER(continent) = $${queryValues.length + 1}`);
      queryValues.push(continentLower);
    }
  }

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const queryStr = `
    SELECT * FROM learning_cards
    ${whereClause}
    ORDER BY card_id
    LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2};
  `;

  queryValues.push(limit);
  queryValues.push(offset);

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
};
