const db = require("../db/connection");

exports.selectMultiChoiceQA = (sub_category_id, continent, level) => {
  let queryStr = `
    SELECT q.*, a.* 
    FROM questions_multiple_choices q
    LEFT JOIN answers_multiple_choices a 
    ON q.question_mc_id = a.question_mc_id
  `;
  
  const queryVals = [];
  const conditions = [];

  const levelsGreenList = ['Beginner', 'Intermediate', 'Advanced']
  const continentsGreenList = ['asia', 'north america', 'south america', 'europe', 'africa', 'oceania', 'world']
  
  if (sub_category_id) {
    conditions.push("q.sub_category_id = $" + (queryVals.length + 1));
    queryVals.push(sub_category_id);
  }
  
  if (continent) {
    conditions.push("q.continent = $" + (queryVals.length + 1));
    queryVals.push(continent.toLowerCase());
  }
  
  if (level) {
    conditions.push("q.level = $" + (queryVals.length + 1));
    queryVals.push(level);
  }
  
  if (conditions.length > 0) {
    queryStr += " WHERE " + conditions.join(" AND ");
  }

  if (!levelsGreenList.includes(level) || !continentsGreenList.includes(continent)) {
        return Promise.reject({status: 400, msg: "Bad Request"});
    }
  
  return db
    .query(queryStr, queryVals)
    .then((result) => {
      return result.rows;
    });
};