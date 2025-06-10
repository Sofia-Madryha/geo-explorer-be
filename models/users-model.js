const db = require("../db/connection");
const format = require("pg-format");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUsersByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "username Not Found!" });
      }
      return rows[0];
    });
};

exports.insertUser = (username, avatar_url) => {
  return db
    .query(
      `INSERT INTO users (username, avatar_url) VALUES ($1, $2) RETURNING *;`,
      [username, avatar_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchUserByUsername = (
  username,
  level_nature,
  level_territory,
  rating,
  avatar_url,
  quizz,
  correct_answers
) => {
  const queries = [];

  if (level_nature) {
    queries.push(format(`level_nature = %L`, level_nature));
  }

  if (level_territory) {
    queries.push(format(`level_territory = %L`, level_territory));
  }

  if (rating) {
    queries.push(format(`rating = %L`, rating));
  }

  if (avatar_url) {
    queries.push(format(`avatar_url = %L`, avatar_url));
  }

  if (quizz) {
    queries.push(format(`quizz = %L`, quizz));
  }

  if (correct_answers) {
    queries.push(format(`correct_answers = %L`, correct_answers));
  }

  const patchQuery = format(
    `UPDATE users SET %s WHERE username = %L RETURNING *;`,
    queries.join(", "),
    username
  );

  return db.query(patchQuery).then(({ rows }) => {
    return rows[0];
  });
};
