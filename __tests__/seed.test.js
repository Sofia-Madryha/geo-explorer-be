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
  });
});
