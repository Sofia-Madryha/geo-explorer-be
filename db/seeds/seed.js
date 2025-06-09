const format = require("pg-format");

const db = require("../connection");

const seed = ({
  categoriesData,
  subCategoriesData,
  learningCardsData,
  answersMultipleChoicesData,
  questionsMultipleChoicesData,
  answersMatchingPairsData,
  questionsMatchingPairsData,
  usersData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS learning_cards;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS answers_multiple_choices;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS questions_multiple_choices;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS answers_matching_pairs;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS questions_matching_pairs;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS sub_categories;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(100) NOT NULL,
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
      return db.query(`CREATE TABLE questions_matching_pairs (
            question_pairs_id SERIAL PRIMARY KEY,
            continent VARCHAR(50),
            category_id INT REFERENCES categories(category_id),
            sub_category_id INT REFERENCES sub_categories(sub_category_id),
            level VARCHAR(50),
            question_text TEXT
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE answers_matching_pairs (
            answer_pairs_id SERIAL PRIMARY KEY,
            question_pairs_id INT REFERENCES questions_matching_pairs(question_pairs_id),
            left_text VARCHAR(500),
            right_text VARCHAR(500)
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE questions_multiple_choices (
            question_mc_id SERIAL PRIMARY KEY,
            continent VARCHAR(50),
            category_id INT REFERENCES categories(category_id),
            sub_category_id INT REFERENCES sub_categories(sub_category_id),
            level VARCHAR(50),
            question_text TEXT
        );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE answers_multiple_choices (
            answer_mc_id SERIAL PRIMARY KEY,
            question_mc_id INT REFERENCES questions_multiple_choices(question_mc_id),
            multiple_choice_text VARCHAR(500),
            correct_answer VARCHAR(100)
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
      return db.query(`CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        level_nature VARCHAR(20) DEFAULT 'beginner',
        level_territory VARCHAR(20) DEFAULT 'beginner',
        rating INT DEFAULT 0,
        avatar_url VARCHAR(1000) NOT NULL);`);
    })
    .then(() => {
      const formattedCategory = categoriesData.map((category) => {
        return [category.category_name, category.img_url];
      });
      const insertCategoriesQuery = format(
        `INSERT INTO categories(category_name, img_url) VALUES %L`,
        formattedCategory
      );
      return db.query(insertCategoriesQuery);
    })
    .then(() => {
      const formattedSubCategory = subCategoriesData.map((sub_category) => {
        return [
          sub_category.sub_category_name,
          sub_category.category_id,
          sub_category.img_url,
        ];
      });
      const insertSubCategoriesQuery = format(
        `INSERT INTO sub_categories(sub_category_name, category_id, img_url) VALUES %L`,
        formattedSubCategory
      );
      return db.query(insertSubCategoriesQuery);
    })
    .then(() => {
      const formattedQuestionsMatching = questionsMatchingPairsData.map(
        (question) => {
          return [
            question.continent,
            question.category_id,
            question.sub_category_id,
            question.level,
            question.question_text,
          ];
        }
      );
      const insertQuestionsMatchingQuery = format(
        `INSERT INTO questions_matching_pairs (
            continent,
            category_id,
            sub_category_id,
            level,
            question_text
        ) VALUES %L`,
        formattedQuestionsMatching
      );
      return db.query(insertQuestionsMatchingQuery);
    })
    .then(() => {
      const formattedAnswersMatching = answersMatchingPairsData.map(
        (answer) => {
          return [
            answer.question_pairs_id,
            answer.left_text,
            answer.right_text,
          ];
        }
      );
      const insertAnswersMatchingQuery = format(
        `INSERT INTO answers_matching_pairs (
            question_pairs_id,
            left_text,
            right_text
        ) VALUES %L`,
        formattedAnswersMatching
      );
      return db.query(insertAnswersMatchingQuery);
    })
    .then(() => {
      const formattedQuestionsMC = questionsMultipleChoicesData.map(
        (question) => {
          return [
            question.continent,
            question.category_id,
            question.sub_category_id,
            question.level,
            question.question_text,
          ];
        }
      );
      const insertQuestionsMCQuery = format(
        `INSERT INTO questions_multiple_choices (
            continent,
            category_id,
            sub_category_id,
            level,
            question_text
        ) VALUES %L`,
        formattedQuestionsMC
      );
      return db.query(insertQuestionsMCQuery);
    })
    .then(() => {
      const formattedAnswersMC = answersMultipleChoicesData.map((answer) => {
        return [
          answer.question_mc_id,
          answer.multiple_choice_text,
          answer.correct_answer,
        ];
      });
      const insertAnswersMCQuery = format(
        `INSERT INTO answers_multiple_choices (
            question_mc_id,
            multiple_choice_text,
            correct_answer
        ) VALUES %L`,
        formattedAnswersMC
      );
      return db.query(insertAnswersMCQuery);
    })
    .then(() => {
      const formattedLearningCards = learningCardsData.map((learningCard) => {
        return [
          learningCard.continent,
          learningCard.sub_category_id,
          learningCard.title,
          learningCard.description,
          learningCard.img_url,
        ];
      });
      const insertLearningCardsQuery = format(
        `INSERT INTO learning_cards(continent, sub_category_id, title, description, img_url) VALUES %L`,
        formattedLearningCards
      );
      return db.query(insertLearningCardsQuery);
    })
    .then(() => {
      const formattedUsers = usersData.map((user) => {
        return [
          user.username,
          user.level_nature,
          user.level_territory,
          user.rating,
          user.avatar_url,
        ];
      });
      const insertUsersQuery = format(
        `INSERT INTO users(username, level_nature, level_territory, rating, avatar_url) VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .catch((err) => {
      console.log("Seeding error:", err);
    });
};

module.exports = seed;
