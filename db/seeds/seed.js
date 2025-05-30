const db = require("../connection");

const seed = ({ categoriesData, subCategoriesData, learningCardsData }) => {
  return db
    .query(`DROP TABLE IF EXISTS learning_cards;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS sub_categories;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(50) NOT NULL,
            img_url VARCHAR(1000)
            );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE sub_categories (
              sub_category_id SERIAL PRIMARY KEY,
              category_id INT REFERENCES categories(category_id),
              sub_category_name VARCHAR(50) NOT NULL,
              img_url VARCHAR(1000)
              );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE learning_cards (
            card_id SERIAL PRIMARY KEY,
            continent VARCHAR(50),
            sub_category_id INT REFERENCES sub_categories(sub_category_id),
            title VARCHAR(100) NOT NULL,
            description TEXT,
            img_url VARCHAR(1000)
        );`);
    })
    .then(() => {
      return categoriesData.map((category) => {
        return db.query(
          `INSERT INTO categories(category_name, img_url) VALUES ($1, $2) RETURNING *;`,
          [category.category_name, category.img_url]
        );
      });
    })
    .then(() => {
      return subCategoriesData.map((sub_category) => {
        return db.query(
          `INSERT INTO sub_categories(sub_category_name, category_id, img_url) VALUES ($1, $2, $3) RETURNING *;`,
          [
            sub_category.sub_category_name,
            sub_category.category_id,
            sub_category.img_url,
          ]
        );
      });
    })
    .then(() => {
      learningCardsData.map((learningCard) => {
        return db.query(
          `INSERT INTO learning_cards(continent, sub_category_id, title, description, img_url) VALUES($1, $2, $3, $4, $5)`,
          [
            learningCard.continent,
            learningCard.sub_category_id,
            learningCard.title,
            learningCard.description,
            learningCard.img_url,
          ]
        );
      });
    })
    .then(() => {
      console.log("Seed completed!");
    });
};

module.exports = seed;
