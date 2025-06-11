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
  mapData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS answers_multiple_choices;`)
    .then(() => db.query(`DROP TABLE IF EXISTS questions_multiple_choices;`))
    .then(() => db.query(`DROP TABLE IF EXISTS answers_matching_pairs;`))
    .then(() => db.query(`DROP TABLE IF EXISTS questions_matching_pairs;`))
    .then(() => db.query(`DROP TABLE IF EXISTS learning_cards;`))
    .then(() => db.query(`DROP TABLE IF EXISTS map;`))
    .then(() => db.query(`DROP TABLE IF EXISTS sub_categories;`))
    .then(() => db.query(`DROP TABLE IF EXISTS categories;`))
    .then(() => db.query(`DROP TABLE IF EXISTS users;`))
    .then(() =>
      db.query(`CREATE TABLE categories (
            category_id SERIAL PRIMARY KEY,
            category_name VARCHAR(100) NOT NULL,
            img_url VARCHAR(1000)
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE sub_categories (
            sub_category_id SERIAL PRIMARY KEY,
            category_id INT REFERENCES categories(category_id),
            sub_category_name VARCHAR(50) NOT NULL,
            img_url VARCHAR(1000)
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE questions_matching_pairs (
            question_pairs_id SERIAL PRIMARY KEY,
            continent VARCHAR(50),
            category_id INT REFERENCES categories(category_id),
            sub_category_id INT REFERENCES sub_categories(sub_category_id),
            level VARCHAR(50),
            question_text TEXT
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE answers_matching_pairs (
            answer_pairs_id SERIAL PRIMARY KEY,
            question_pairs_id INT REFERENCES questions_matching_pairs(question_pairs_id),
            left_text VARCHAR(500),
            right_text VARCHAR(500)
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE questions_multiple_choices (
            question_mc_id SERIAL PRIMARY KEY,
            continent VARCHAR(50),
            category_id INT REFERENCES categories(category_id),
            sub_category_id INT REFERENCES sub_categories(sub_category_id),
            level VARCHAR(50),
            question_text TEXT
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE answers_multiple_choices (
            answer_mc_id SERIAL PRIMARY KEY,
            question_mc_id INT REFERENCES questions_multiple_choices(question_mc_id),
            multiple_choice_text VARCHAR(500),
            correct_answer VARCHAR(100)
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE learning_cards (
            card_id SERIAL PRIMARY KEY,
            continent VARCHAR(50),
            sub_category_id INT REFERENCES sub_categories(sub_category_id),
            title VARCHAR(100) NOT NULL,
            description TEXT,
            img_url VARCHAR(1000)
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE map (
            map_id SERIAL PRIMARY KEY,
            continent VARCHAR(50) NOT NULL,
            level VARCHAR(50),
            category_id INT REFERENCES categories(category_id),
            instruction VARCHAR(1000) NOT NULL,
            location VARCHAR(1000) NOT NULL
          );`)
    )
    .then(() =>
      db.query(`CREATE TABLE users (
            user_id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            level_nature VARCHAR(20) DEFAULT 'Beginner',
            level_territory VARCHAR(20) DEFAULT 'Beginner',
            rating INT DEFAULT 0,
            avatar_url VARCHAR(1000) NOT NULL,
            nature_quiz INT DEFAULT 1,
            territory_quiz INT DEFAULT 1,
            correct_answers TEXT
          );`)
    )
    .then(() => {
      const formattedCategory = categoriesData.map(
        ({ category_name, img_url }) => [category_name, img_url]
      );
      const insertCategoriesQuery = format(
        `INSERT INTO categories(category_name, img_url) VALUES %L`,
        formattedCategory
      );
      return db.query(insertCategoriesQuery);
    })
    .then(() => {
      const formattedSubCategory = subCategoriesData.map(
        ({ sub_category_name, category_id, img_url }) => [
          sub_category_name,
          category_id,
          img_url,
        ]
      );
      const insertSubCategoriesQuery = format(
        `INSERT INTO sub_categories(sub_category_name, category_id, img_url) VALUES %L`,
        formattedSubCategory
      );
      return db.query(insertSubCategoriesQuery);
    })
    .then(() => {
      const formattedQuestionsMatching = questionsMatchingPairsData.map(
        ({ continent, category_id, sub_category_id, level, question_text }) => [
          continent,
          category_id,
          sub_category_id,
          level,
          question_text,
        ]
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
        ({ question_pairs_id, left_text, right_text }) => [
          question_pairs_id,
          left_text,
          right_text,
        ]
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
        ({ continent, category_id, sub_category_id, level, question_text }) => [
          continent,
          category_id,
          sub_category_id,
          level,
          question_text,
        ]
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
      const formattedAnswersMC = answersMultipleChoicesData.map(
        ({ question_mc_id, multiple_choice_text, correct_answer }) => [
          question_mc_id,
          multiple_choice_text,
          correct_answer,
        ]
      );
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
      const formattedLearningCards = learningCardsData.map(
        ({ continent, sub_category_id, title, description, img_url }) => [
          continent,
          sub_category_id,
          title,
          description,
          img_url,
        ]
      );
      const insertLearningCardsQuery = format(
        `INSERT INTO learning_cards(continent, sub_category_id, title, description, img_url) VALUES %L`,
        formattedLearningCards
      );
      return db.query(insertLearningCardsQuery);
    })
    .then(() => {
      const formattedMapData = mapData.map(
        ({ continent, level, category_id, instruction, location }) => [
          continent,
          level,
          category_id,
          instruction,
          location,
        ]
      );
      const insertMapQuery = format(
        `INSERT INTO map(continent, level, category_id, instruction, location) VALUES %L`,
        formattedMapData
      );
      return db.query(insertMapQuery);
    })
    .then(() => {
      const formattedUsers = usersData.map(
        ({
          username,
          level_nature,
          level_territory,
          rating,
          avatar_url,
          nature_quiz,
          territory_quiz,
          correct_answers,
        }) => [
          username,
          level_nature,
          level_territory,
          rating,
          avatar_url,
          nature_quiz,
          territory_quiz,
          correct_answers,
        ]
      );
      const insertUsersQuery = format(
        `INSERT INTO users(username, level_nature, level_territory, rating, avatar_url, nature_quiz, territory_quiz, correct_answers) VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .catch((err) => {
      console.log("Seeding error:", err);
    });
};

module.exports = seed;
