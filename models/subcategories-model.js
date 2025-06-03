const db = require("../db/connection");

exports.selectSubCategories = () => {
  return db.query(`SELECT * FROM sub_categories`).then((result) => {
    return result.rows;
  });
};
