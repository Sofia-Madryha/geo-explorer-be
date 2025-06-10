const db = require("../db/connection");

exports.selectMapByFilters = (category_id, continent, level) => {
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
    conditions.push(`category_id = $${queryValues.length + 1}`);
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
      conditions.push(`LOWER(continent) = $${queryValues.length + 1}`);
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
    conditions.push(`level = $${queryValues.length + 1}`);
    queryValues.push(level);
  }

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const queryStr = `
    SELECT * FROM map
    ${whereClause}
    ORDER BY map_id;
  `;

  return db.query(queryStr, queryValues).then(({ rows }) => rows);
};
