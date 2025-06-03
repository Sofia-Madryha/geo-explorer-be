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

describe(" GET/ Sub-Categories", () => {
  test("1 200-responds with an array of sub-categories", () => {
    return request(app)
      .get("/api/subcategories")
      .expect(200)
      .then(({ body: { subcategories } }) => {
        expect(subcategories.length).toBe(4);
        subcategories.forEach((subcategory) => {
          expect(subcategory).toMatchObject({
            sub_category_id: expect.any(Number),
            category_id: expect.any(Number),
            sub_category_name: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });
});

describe(" GET/ Multi-choice questions and answers", () => {
  test.only("200-responds with an array of multi-choice questions and answers", () => {
    return request(app)
      .get("/api/multichoice-qa")
      .expect(200)
      .then(({ body: { multichoice_qa } }) => {
        expect(multichoice_qa.length).toBe(23);
        multichoice_qa.forEach((item) => {
          expect(item).toMatchObject({
            question_mc_id: expect.any(Number),
            continent: expect.any(String),
            sub_category_id: expect.any(Number),
            level: expect.any(String),
            question_text: expect.any(String),
            answer_mc_id: expect.any(Number),
            multiple_choice_text: expect.any(String),
            correct_answer: expect.any(String),
          });
        });
      });
  });
  test.skip("200-responds with an array of multi-choice questions and answers", () => {
    return request(app)
      .get(
        "/api/multichoice-qa?level=beginner&&continent=asia&&sub_category_id=4"
      )
      .expect(200)
      .then(({ body: { multichoice_qa } }) => {
        expect(multichoice_qa.length).toBe(23);
        multichoice_qa.forEach((item) => {
          expect(item).toMatchObject({
            question_mc_id: expect.any(Number),
            continent: "asia",
            sub_category_id: 4,
            level: "Beginner",
            question_text: expect.any(String),
            answer_mc_id: expect.any(Number),
            multiple_choice_text: expect.any(String),
            correct_answer: expect.any(String),
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

describe("3. GET /api/learning-cards/sub-category/:sub_category_id", () => {
  test("3a. 200: return learning cards array with valid sub_category_id", () => {
    return request(app)
      .get("/api/learning-cards/sub-categories/4")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.learningCards)).toBe(true);
        expect(res.body.learningCards.length).toBe(8);

        expect(res.body.learningCards[0]).toMatchObject({
          card_id: expect.any(Number),
          continent: "asia",
          sub_category_id: 4,
          title: expect.any(String),
          description: expect.any(String),
          img_url: expect.any(String),
        });
      });
  });
  test("3b. 404: return 404 Not Found if valid format but not avaliable", () => {
    return request(app)
      .get("/api/learning-cards/sub-categories/54321")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 Not Found");
      });
  });
  test("3c. 500: handle internal server error", () => {
    const db = require("../db/connection");
    jest.spyOn(db, "query").mockRejectedValueOnce(new Error("DB error"));
    return request(app)
      .get("/api/learning-cards/sub-categories/4")
      .expect(500)
      .then((res) => {
        expect(res.body.msg).toBe("500 Internal Server Error");
        db.query.mockRestore();
      });
  });
});
