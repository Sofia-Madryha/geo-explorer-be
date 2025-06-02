const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const categories = require("../db/data/test-data/categories");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("1. GET/ Categories", () => {
  test("1 200-responds with an array of catgories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories.length).toBe(2);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            category_id: expect.any(Number),
            category_name: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});

describe("2. 404: Not Found - BAD url-error", () => {
  test("2. 404-attemping to access a non-existing endpoint ", () => {
    return request(app)
      .get("/api/abc")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
