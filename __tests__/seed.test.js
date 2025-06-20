const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("seed", () => {
  describe("categories table", () => {
    test("categories table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'categories'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("categories table has category_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'categories'
            AND column_name = 'category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("category_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('categories_category_id_seq'::regclass)"
          );
        });
    });

    test("categories table has category_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'categories';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("category_id");
        });
    });

    test("categories table has category_name column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'categories'
            AND column_name = 'category_name';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("category_name");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("categories table has img_url column of varying character of max length 1000", () => {
      return db
        .query(
          `SELECT column_name, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'categories'
            AND column_name = 'img_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("img_url");
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });

  describe("sub_categories table", () => {
    test("sub_categories table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'sub_categories'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("sub_categories table has sub_category_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'sub_categories'
            AND column_name = 'sub_category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("sub_category_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('sub_categories_sub_category_id_seq'::regclass)"
          );
        });
    });

    test("sub_categories table has sub_category_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'sub_categories';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("sub_category_id");
        });
    });

    test("sub_categories table has category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'sub_categories'
            AND column_name = 'category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("category_id column references category_id from the categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'sub_categories'
          AND kcu.column_name = 'category_id'
          AND ccu.table_name = 'categories'
          AND ccu.column_name = 'category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("sub_categories table has sub_category_name column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'sub_categories'
            AND column_name = 'sub_category_name';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("sub_category_name");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("sub_categories table has img_url column of varying character of max length 1000", () => {
      return db
        .query(
          `SELECT column_name, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'sub_categories'
            AND column_name = 'img_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("img_url");
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });

  describe("questions_matching_pairs table", () => {
    test("questions_matching_pairs table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'questions_matching_pairs'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("questions_matching_pairs table has question_pairs_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'questions_matching_pairs'
            AND column_name = 'question_pairs_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("question_pairs_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('questions_matching_pairs_question_pairs_id_seq'::regclass)"
          );
        });
    });

    test("questions_matching_pairs table has question_pairs_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'questions_matching_pairs';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("question_pairs_id");
        });
    });

    test("questions_matching_pairs table has continent column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_matching_pairs'
            AND column_name = 'continent';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("continent");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("questions_matching_pairs table has category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_matching_pairs'
            AND column_name = 'category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("category_id column references category_id from the categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'questions_matching_pairs'
          AND kcu.column_name = 'category_id'
          AND ccu.table_name = 'categories'
          AND ccu.column_name = 'category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("questions_matching_pairs table has sub_category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_matching_pairs'
            AND column_name = 'sub_category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("sub_category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("sub_category_id column references sub_category_id from the sub_categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'questions_matching_pairs'
          AND kcu.column_name = 'sub_category_id'
          AND ccu.table_name = 'sub_categories'
          AND ccu.column_name = 'sub_category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("questions_matching_pairs table has level column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_matching_pairs'
            AND column_name = 'level';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("level");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("questions_matching_pairs table has question_text column as text", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_matching_pairs'
            AND column_name = 'question_text';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("question_text");
          expect(column.data_type).toBe("text");
        });
    });
  });

  describe("answers_matching_pairs teble", () => {
    test("answers_matching_pairs table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'answers_matching_pairs'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("answers_matching_pairs table has answer_pairs_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'answers_matching_pairs'
            AND column_name = 'answer_pairs_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("answer_pairs_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('answers_matching_pairs_answer_pairs_id_seq'::regclass)"
          );
        });
    });

    test("answers_matching_pairs table has answer_pairs_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'answers_matching_pairs';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("answer_pairs_id");
        });
    });

    test("answers_matching_pairs table has question_pairs_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'answers_matching_pairs'
            AND column_name = 'question_pairs_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("question_pairs_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("question_pairs_id column references question_pairs_id from the questions_matching_pairs table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'answers_matching_pairs'
          AND kcu.column_name = 'question_pairs_id'
          AND ccu.table_name = 'questions_matching_pairs'
          AND ccu.column_name = 'question_pairs_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("answers_matching_pairs table has left_text column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'answers_matching_pairs'
            AND column_name = 'left_text';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("left_text");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("answers_matching_pairs table has right_text column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'answers_matching_pairs'
            AND column_name = 'right_text';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("right_text");
          expect(column.data_type).toBe("character varying");
        });
    });
  });

  describe("questions_multiple_choices table", () => {
    test("questions_multiple_choices table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'questions_multiple_choices'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("questions_multiple_choices table has question_mc_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'questions_multiple_choices'
            AND column_name = 'question_mc_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("question_mc_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('questions_multiple_choices_question_mc_id_seq'::regclass)"
          );
        });
    });

    test("questions_multiple_choices table has question_mc_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'questions_multiple_choices';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("question_mc_id");
        });
    });

    test("questions_multiple_choices table has continent column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_multiple_choices'
            AND column_name = 'continent';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("continent");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("questions_multiple_choices table has category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_multiple_choices'
            AND column_name = 'category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("category_id column references category_id from the categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'questions_multiple_choices'
          AND kcu.column_name = 'category_id'
          AND ccu.table_name = 'categories'
          AND ccu.column_name = 'category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("questions_multiple_choices table has sub_category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_multiple_choices'
            AND column_name = 'sub_category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("sub_category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("sub_category_id column references sub_category_id from the sub_categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'questions_multiple_choices'
          AND kcu.column_name = 'sub_category_id'
          AND ccu.table_name = 'sub_categories'
          AND ccu.column_name = 'sub_category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("questions_multiple_choices table has level column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_multiple_choices'
            AND column_name = 'level';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("level");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("questions_multiple_choices table has question_text column as text", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'questions_multiple_choices'
            AND column_name = 'question_text';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("question_text");
          expect(column.data_type).toBe("text");
        });
    });
  });

  describe("answers_multiple_choices table", () => {
    test("answers_multiple_choices table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'answers_multiple_choices'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("answers_multiple_choices table has answer_mc_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'answers_multiple_choices'
            AND column_name = 'answer_mc_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("answer_mc_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('answers_multiple_choices_answer_mc_id_seq'::regclass)"
          );
        });
    });

    test("answers_multiple_choices table has answer_mc_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'answers_multiple_choices';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("answer_mc_id");
        });
    });

    test("answers_multiple_choices table has question_mc_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'answers_multiple_choices'
            AND column_name = 'question_mc_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("question_mc_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("question_mc_id column references question_mc_id from the questions_multiple_choices table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'answers_multiple_choices'
          AND kcu.column_name = 'question_mc_id'
          AND ccu.table_name = 'questions_multiple_choices'
          AND ccu.column_name = 'question_mc_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("answers_multiple_choices table has multiple_choice_text column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'answers_multiple_choices'
            AND column_name = 'multiple_choice_text';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("multiple_choice_text");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("answers_multiple_choices table has correct_answer column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'answers_multiple_choices'
            AND column_name = 'correct_answer';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("correct_answer");
          expect(column.data_type).toBe("character varying");
        });
    });
  });

  describe("learning_cards table", () => {
    test("learning_cards table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'learning_cards'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("learning_cards table has card_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'learning_cards'
            AND column_name = 'card_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("card_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('learning_cards_card_id_seq'::regclass)"
          );
        });
    });

    test("learning_cards table has card_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'learning_cards';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("card_id");
        });
    });

    test("learning_cards table has continent column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'learning_cards'
            AND column_name = 'continent';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("continent");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("learning_cards table has sub_category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'learning_cards'
            AND column_name = 'sub_category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("sub_category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("sub_category_id column references sub_category_id from the sub_categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'learning_cards'
          AND kcu.column_name = 'sub_category_id'
          AND ccu.table_name = 'sub_categories'
          AND ccu.column_name = 'sub_category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("learning_cards table has title column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'learning_cards'
            AND column_name = 'title';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("title");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("learning_cards table has description column as text", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'learning_cards'
            AND column_name = 'description';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("description");
          expect(column.data_type).toBe("text");
        });
    });

    test("learning_cards table has img_url column of varying character of max length 1000", () => {
      return db
        .query(
          `SELECT column_name, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'learning_cards'
            AND column_name = 'img_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("img_url");
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });

  describe("users table", () => {
    test("users table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
              SELECT FROM 
                  information_schema.tables xx
              WHERE 
                  table_name = 'users'
              );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("users table has user_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'user_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("user_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('users_user_id_seq'::regclass)"
          );
        });
    });

    test("users table has user_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = 'users';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("user_id");
        });
    });

    test("users table has username column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'username';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("username");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("users table has username column as unique", () => {
      return db
        .query(
          `SELECT column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            WHERE tc.constraint_type = 'UNIQUE'
            AND tc.table_name = 'users';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("username");
        });
    });

    test("users table has level_nature column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'level_nature';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("level_nature");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("level_nature column has default value as 'Beginner'", () => {
      return db
        .query(
          `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'level_nature';`
        )
        .then(({ rows: [{ column_default }] }) => {
          expect(column_default).toBe("'Beginner'::character varying");
        });
    });

    test("users table has level_territory column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'level_territory';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("level_territory");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("level_territory column has default value as 'Beginner'", () => {
      return db
        .query(
          `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'level_territory';`
        )
        .then(({ rows: [{ column_default }] }) => {
          expect(column_default).toBe("'Beginner'::character varying");
        });
    });

    test("users table has rating column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'rating';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("rating");
          expect(column.data_type).toBe("integer");
        });
    });

    test("rating column has default value as 0", () => {
      return db
        .query(
          `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'rating';`
        )
        .then(({ rows: [{ column_default }] }) => {
          expect(column_default).toBe("0");
        });
    });

    test("users table has avatar_url column of varying character of max length 1000", () => {
      return db
        .query(
          `SELECT column_name, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'avatar_url';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("avatar_url");
          expect(column.character_maximum_length).toBe(1000);
        });
    });

    test("users table has nature_quiz column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'nature_quiz';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("nature_quiz");
          expect(column.data_type).toBe("integer");
        });
    });

    test("nature_quiz column has default value as 1", () => {
      return db
        .query(
          `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'nature_quiz';`
        )
        .then(({ rows: [{ column_default }] }) => {
          expect(column_default).toBe("1");
        });
    });

    test("users table has territory_quiz column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'territory_quiz';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("territory_quiz");
          expect(column.data_type).toBe("integer");
        });
    });

    test("territory_quiz column has default value as 1", () => {
      return db
        .query(
          `SELECT column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'territory_quiz';`
        )
        .then(({ rows: [{ column_default }] }) => {
          expect(column_default).toBe("1");
        });
    });

    test("users table has correct_answers column as text", () => {
      return db
        .query(
          `SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name = 'correct_answers';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("correct_answers");
          expect(column.data_type).toBe("text");
        });
    });
  });

  describe("map table", () => {
    test("map table exists", () => {
      return db
        .query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = 'map'
          );`
        )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        });
    });

    test("map table has map_id column as a serial", () => {
      return db
        .query(
          `SELECT column_name, data_type, column_default
          FROM information_schema.columns
          WHERE table_name = 'map'
          AND column_name = 'map_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("map_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('map_map_id_seq'::regclass)"
          );
        });
    });

    test("map table has map_id column as the primary key", () => {
      return db
        .query(
          `SELECT column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_name = 'map';`
        )
        .then(({ rows: [{ column_name }] }) => {
          expect(column_name).toBe("map_id");
        });
    });

    test("map table has continent column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'map'
          AND column_name = 'continent';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("continent");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("map table has level column as varying character", () => {
      return db
        .query(
          `SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'map'
          AND column_name = 'level';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("level");
          expect(column.data_type).toBe("character varying");
        });
    });

    test("map table has category_id column as integer", () => {
      return db
        .query(
          `SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = 'map'
          AND column_name = 'category_id';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("category_id");
          expect(column.data_type).toBe("integer");
        });
    });

    test("category_id column references category_id from the categories table", () => {
      return db
        .query(
          `
        SELECT *
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = 'map'
          AND kcu.column_name = 'category_id'
          AND ccu.table_name = 'categories'
          AND ccu.column_name = 'category_id';
      `
        )
        .then(({ rows }) => {
          expect(rows).toHaveLength(1);
        });
    });

    test("map table has instruction column as varying character of max length 1000", () => {
      return db
        .query(
          `SELECT column_name, data_type, character_maximum_length
          FROM information_schema.columns
          WHERE table_name = 'map'
          AND column_name = 'instruction';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("instruction");
          expect(column.data_type).toBe("character varying");
          expect(column.character_maximum_length).toBe(1000);
        });
    });

    test("map table has location column as varying character of max length 1000", () => {
      return db
        .query(
          `SELECT column_name, data_type, character_maximum_length
          FROM information_schema.columns
          WHERE table_name = 'map'
          AND column_name = 'location';`
        )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("location");
          expect(column.data_type).toBe("character varying");
          expect(column.character_maximum_length).toBe(1000);
        });
    });
  });

  describe("data insertion", () => {
    test("categories data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows: categories }) => {
          expect(categories).toHaveLength(2);
          categories.forEach((category) => {
            expect(category).toHaveProperty("category_id");
            expect(category).toHaveProperty("category_name");
            expect(category).toHaveProperty("img_url");
          });
        });
    });

    test("sub_categories data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM sub_categories;`)
        .then(({ rows: sub_categories }) => {
          expect(sub_categories).toHaveLength(4);
          sub_categories.forEach((sub_category) => {
            expect(sub_category).toHaveProperty("sub_category_id");
            expect(sub_category).toHaveProperty("category_id");
            expect(sub_category).toHaveProperty("sub_category_name");
            expect(sub_category).toHaveProperty("img_url");
          });
        });
    });

    test("questions_matching_pairs data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM questions_matching_pairs;`)
        .then(({ rows: questions_matching_pairs }) => {
          expect(questions_matching_pairs).toHaveLength(10);
          questions_matching_pairs.forEach((question) => {
            expect(question).toHaveProperty("question_pairs_id");
            expect(question).toHaveProperty("continent");
            expect(question).toHaveProperty("category_id");
            expect(question).toHaveProperty("sub_category_id");
            expect(question).toHaveProperty("level");
            expect(question).toHaveProperty("question_text");
          });
        });
    });

    test("answers_matching_pairs data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM answers_matching_pairs;`)
        .then(({ rows: answers_matching_pairs }) => {
          expect(answers_matching_pairs).toHaveLength(48);
          answers_matching_pairs.forEach((answer) => {
            expect(answer).toHaveProperty("answer_pairs_id");
            expect(answer).toHaveProperty("question_pairs_id");
            expect(answer).toHaveProperty("left_text");
            expect(answer).toHaveProperty("right_text");
          });
        });
    });

    test("questions_multiple_choices data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM questions_multiple_choices;`)
        .then(({ rows: questions_multiple_choices }) => {
          expect(questions_multiple_choices).toHaveLength(23);
          questions_multiple_choices.forEach((question) => {
            expect(question).toHaveProperty("question_mc_id");
            expect(question).toHaveProperty("continent");
            expect(question).toHaveProperty("category_id");
            expect(question).toHaveProperty("sub_category_id");
            expect(question).toHaveProperty("level");
            expect(question).toHaveProperty("question_text");
          });
        });
    });

    test("answers_multiple_choices data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM answers_multiple_choices;`)
        .then(({ rows: answers_multiple_choices }) => {
          expect(answers_multiple_choices).toHaveLength(23);
          answers_multiple_choices.forEach((answer) => {
            expect(answer).toHaveProperty("answer_mc_id");
            expect(answer).toHaveProperty("question_mc_id");
            expect(answer).toHaveProperty("multiple_choice_text");
            expect(answer).toHaveProperty("correct_answer");
          });
        });
    });

    test("learning_cards data has been inserted correctly", () => {
      return db
        .query(`SELECT * FROM learning_cards;`)
        .then(({ rows: learning_cards }) => {
          expect(learning_cards).toHaveLength(38);
          learning_cards.forEach((learning_card) => {
            expect(learning_card).toHaveProperty("card_id");
            expect(learning_card).toHaveProperty("continent");
            expect(learning_card).toHaveProperty("sub_category_id");
            expect(learning_card).toHaveProperty("title");
            expect(learning_card).toHaveProperty("description");
            expect(learning_card).toHaveProperty("img_url");
          });
        });
    });

    test("users data has been inserted correctly", () => {
      return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
        expect(users).toHaveLength(40);
        users.forEach((user) => {
          expect(user).toHaveProperty("user_id");
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("level_nature");
          expect(user).toHaveProperty("level_territory");
          expect(user).toHaveProperty("rating");
          expect(user).toHaveProperty("avatar_url");
          expect(user).toHaveProperty("nature_quiz");
          expect(user).toHaveProperty("territory_quiz");
          expect(user).toHaveProperty("correct_answers");
        });
      });
    });

    test("map data has been inserted correctly", () => {
      return db.query(`SELECT * FROM map;`).then(({ rows: map }) => {
        expect(map).toHaveLength(137);
        map.forEach((eachMap) => {
          expect(eachMap).toHaveProperty("map_id");
          expect(eachMap).toHaveProperty("continent");
          expect(eachMap).toHaveProperty("level");
          expect(eachMap).toHaveProperty("category_id");
          expect(eachMap).toHaveProperty("instruction");
          expect(eachMap).toHaveProperty("location");
        });
      });
    });
  });
});
