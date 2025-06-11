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
  test("200-responds with an array of multi-choice questions and answers", () => {
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
  test("200-responds with an array of multi-choice questions and answers", () => {
    return request(app)
      .get("/api/multichoice-qa?level=Beginner&&continent=asia&&category_id=1")
      .expect(200)
      .then(({ body: { multichoice_qa } }) => {
        expect(multichoice_qa.length).toBe(9);
        multichoice_qa.forEach((item) => {
          expect(item).toMatchObject({
            question_mc_id: expect.any(Number),
            continent: "asia",
            category_id: 1,
            level: "Beginner",
            question_text: expect.any(String),
            answer_mc_id: expect.any(Number),
            multiple_choice_text: expect.any(String),
            correct_answer: expect.any(String),
          });
        });
      });
  });
  test("200-responds with an array of multi-choice questions and answers", () => {
    return request(app)
      .get(
        "/api/multichoice-qa?level=Intermediate&&continent=asia&&category_id=1"
      )
      .expect(200)
      .then(({ body: { multichoice_qa } }) => {
        expect(multichoice_qa.length).toBe(7);
        multichoice_qa.forEach((item) => {
          expect(item).toMatchObject({
            question_mc_id: expect.any(Number),
            continent: "asia",
            category_id: 1,
            level: "Intermediate",
            question_text: expect.any(String),
            answer_mc_id: expect.any(Number),
            multiple_choice_text: expect.any(String),
            correct_answer: expect.any(String),
          });
        });
      });
  });
  test("400: responds with Bad Request when passed invalid level query", () => {
    return request(app)
      .get("/api/multichoice-qa?level=potato&&continent=asia&&category_id=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: responds with Bad Request when passed invalid continent query", () => {
    return request(app)
      .get(
        "/api/multichoice-qa?level=Beginner&&continent=potato&&category_id=1"
      )
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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

describe("3. GET /api/learning-cards/", () => {
  test("3a. 200: return learning cards array with valid sub_category_id & continent on page 2", () => {
    return request(app)
      .get("/api/learning-cards?sub_category_id=4&continent=asia&page=1")
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
      .get("/api/learning-cards?sub_category_id=999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("404 Not Found");
      });
  });
  test("3c. 400: returns 400 Bad Request for invalid continent", () => {
    return request(app)
      .get("/api/learning-cards?continent=middleofnowhere")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("400 Bad Request");
      });
  });
});

describe(" GET /api/users", () => {
  test("1 200-responds with an array of users object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toMatchObject({
            user_id: expect.any(Number),
            username: expect.any(String),
            level_nature: expect.any(String),
            level_territory: expect.any(String),
            rating: expect.any(Number),
            avatar_url: expect.any(String),
            nature_quiz: expect.any(Number),
            territory_quiz: expect.any(Number),
            correct_answers: expect.any(String),
          });
        });
      });
  });
});

describe(" POST /api/users", () => {
  test("1 201: Respond with the added user obj", () => {
    const postObj = {
      username: "new-user",
      avatar_url: "https://avatar.iran.liara.run/public/23",
    };

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: expect.any(Number),
          username: "new-user",
          level_nature: "Beginner",
          level_territory: "Beginner",
          rating: 0,
          avatar_url: "https://avatar.iran.liara.run/public/23",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: null,
        });
      });
  });

  test("2 409: Respond with username already exists! msg when trying to add user with username already exist in database", () => {
    const postObj = {
      username: "lisa_j",
      avatar_url: "https://avatar.iran.liara.run/public/23",
    };

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(409)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username already exists!");
      });
  });

  test("3 400: Respond with Bad Request! msg when trying to add user with empty object in post object", () => {
    const postObj = {};

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("4 400: Respond with Bad Request! msg when trying to add user without avatar_url in post object", () => {
    const postObj = {
      username: "test-user",
    };

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("5 400: Respond with Bad Request! msg when trying to add user without username in post object", () => {
    const postObj = {
      avatar_url: "avatarUrl",
    };

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("6 400: Respond with Bad Request! msg when trying to add user with incorrect datatype in post object", () => {
    const postObj = {
      username: [1, 2, 3],
      avatar_url: 456,
    };

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("7 400: Respond with Bad Request! msg when trying to add user with empty strings in post object", () => {
    const postObj = {
      username: " ",
      avatar_url: "",
    };

    return request(app)
      .post("/api/users")
      .send(postObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});

describe(" GET /api/users/:username", () => {
  test("1 200-responds with a user object", () => {
    return request(app)
      .get("/api/users/susanzzzz")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 2,
          username: "susanzzzz",
          level_nature: "Intermediate",
          level_territory: "Intermediate",
          rating: 60,
          avatar_url: "https://avatar.iran.liara.run/public/77",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("2 404-Respond with username Not Found! msg when provided username not in database", () => {
    return request(app)
      .get("/api/users/NotAUsername")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username Not Found!");
      });
  });
});

describe(" PATCH /api/users/:username", () => {
  test("1 200: Respond with an updated user object with updated level_nature", () => {
    const patchObj = { level_nature: "Intermediate" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Intermediate",
          level_territory: "Intermediate",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("2 200: Respond with an updated user object with updated level_territory", () => {
    const patchObj = { level_territory: "Advanced" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Beginner",
          level_territory: "Advanced",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("3 200: Respond with an updated user object with updated rating", () => {
    const patchObj = { rating: 100 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Beginner",
          level_territory: "Intermediate",
          rating: 100,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("4 200: Respond with an updated user object with updated avatar_url", () => {
    const patchObj = { avatar_url: "newUrl" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Beginner",
          level_territory: "Intermediate",
          rating: 15,
          avatar_url: "newUrl",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("5 200: Respond with an updated user object with updated level_nature and rating", () => {
    const patchObj = { level_nature: "Intermediate", rating: 50 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Intermediate",
          level_territory: "Intermediate",
          rating: 50,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("6 404: Respond with username Not Found! msg when trying to update user with username not in database", () => {
    const patchObj = { level_nature: "Intermediate", rating: 50 };

    return request(app)
      .patch("/api/users/NotAUsername")
      .send(patchObj)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username Not Found!");
      });
  });

  test("7 400: Respond with Bad Request! msg when trying to update user with empty patch object", () => {
    const patchObj = {};

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("8 400: Respond with Bad Request! msg when trying to update user with wrong datatype in patch object", () => {
    const patchObj = { level_nature: 123 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("9 400: Respond with Bad Request! msg when trying to update user with wrong datatype in patch object", () => {
    const patchObj = { rating: "high" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("10 400: Respond with Bad Request! msg when trying to update user with empty string in patch object", () => {
    const patchObj = { level_nature: " " };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("11 200: Respond with an updated user object with updated quizz", () => {
    const patchObj = { nature_quiz: 3 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Beginner",
          level_territory: "Intermediate",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 3,
          territory_quiz: 1,
          correct_answers: "",
        });
      });
  });

  test("12 200: Respond with an updated user object with updated quizz", () => {
    const patchObj = { territory_quiz: 2 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Beginner",
          level_territory: "Intermediate",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 1,
          territory_quiz: 2,
          correct_answers: "",
        });
      });
  });

  test("13 200: Respond with an updated user object with updated correct_answers", () => {
    const patchObj = { correct_answers: "[1, 2, 3]" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "Beginner",
          level_territory: "Intermediate",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
          nature_quiz: 1,
          territory_quiz: 1,
          correct_answers: "[1, 2, 3]",
        });
      });
  });

  test("14 400: Respond with Bad Request! msg when trying to update user with wrong datatype in patch object", () => {
    const patchObj = { nature_quiz: "3" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("15 400: Respond with Bad Request! msg when trying to update user with wrong datatype in patch object", () => {
    const patchObj = { territory_quiz: "3" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("16 400: Respond with Bad Request! msg when trying to update user with wrong datatype in patch object", () => {
    const patchObj = { correct_answers: 12 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });

  test("17 400: Respond with Bad Request! msg when trying to update user with empty string in patch object", () => {
    const patchObj = { correct_answers: " " };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request!");
      });
  });
});

describe("5 Matching pairs - GET /api/matching-pairs", () => {
  test("5a. 200: returns matching pairs for category_id=1, continent=asia, level=Beginner", () => {
    return request(app)
      .get("/api/matching-pairs?category_id=1&continent=asia&level=Beginner")
      .expect(200)
      .then(({ body: { matchingPairs } }) => {
        expect(Array.isArray(matchingPairs)).toBe(true);
        expect(matchingPairs.length).toBe(3);

        matchingPairs.forEach((item) => {
          expect(item).toMatchObject({
            question_pairs_id: expect.any(Number),
            continent: "asia",
            category_id: 1,
            level: "Beginner",
            question_text: expect.any(String),
            answers: expect.any(Array),
          });
          item.answers.forEach((ans) => {
            expect(ans).toMatchObject({
              answer_pairs_id: expect.any(Number),
              left_text: expect.any(String),
              right_text: expect.any(String),
            });
          });
        });
      });
  });

  test("5b. 200: returns matching pairs filtered only by continent=asia", () => {
    return request(app)
      .get("/api/matching-pairs?continent=asia")
      .expect(200)
      .then(({ body: { matchingPairs } }) => {
        expect(Array.isArray(matchingPairs)).toBe(true);
        expect(matchingPairs.length).toBeGreaterThan(0);

        matchingPairs.forEach((item) => {
          expect(item.continent.toLowerCase()).toBe("asia");
          expect(item.answers).toBeDefined();
          expect(Array.isArray(item.answers)).toBe(true);
        });
      });
  });

  test("5c. 200: returns matching pairs for continent=world (all continents)", () => {
    return request(app)
      .get("/api/matching-pairs?continent=world")
      .expect(200)
      .then(({ body: { matchingPairs } }) => {
        expect(Array.isArray(matchingPairs)).toBe(true);
        expect(matchingPairs.length).toBeGreaterThan(0);

        matchingPairs.forEach((item) => {
          expect(item.answers).toBeDefined();
          expect(Array.isArray(item.answers)).toBe(true);
        });
      });
  });

  test("5d. 400: returns Bad Request for invalid continent query", () => {
    return request(app)
      .get("/api/matching-pairs?continent=abcde")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });

  test("5e. 400: returns Bad Request for invalid level query", () => {
    return request(app)
      .get("/api/matching-pairs?level=super-hard")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });

  test("5f. 404: returns Not Found if no matching pairs for given filters", () => {
    return request(app)
      .get("/api/matching-pairs?category_id=9999&continent=asia&level=Beginner")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
describe("6. Map Questions - GET /api/map", () => {
  test("6a. 200: returns all map questions with expected shape", () => {
    return request(app)
      .get("/api/map")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.mapQuestions)).toBe(true);
        expect(body.mapQuestions.length).toBe(137);
        body.mapQuestions.forEach((item) => {
          expect(item).toMatchObject({
            map_id: expect.any(Number),
            continent: expect.any(String),
            level: expect.any(String),
            category_id: expect.any(Number),
            instruction: expect.any(String),
            location: expect.any(String),
          });
        });
      });
  });

  test("6b. 200: returns map questions filtered by continent (asia)", () => {
    return request(app)
      .get("/api/map?continent=asia")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.mapQuestions)).toBe(true);
        expect(body.mapQuestions.length).toBe(32);
        body.mapQuestions.forEach((item) => {
          expect(item.continent.toLowerCase()).toBe("asia");
        });
      });
  });

  test("6c. 200: returns map questions filtered by level (Beginner) and category territories", () => {
    return request(app)
      .get("/api/map?level=Beginner&category_id=2")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.mapQuestions)).toBe(true);
        expect(body.mapQuestions.length).toBe(16);
        body.mapQuestions.forEach((item) => {
          expect(item.level).toBe("Beginner");
        });
      });
  });

  test("6d. 400: returns Bad Request for invalid continent", () => {
    return request(app)
      .get("/api/map?continent=asiaasiaasia")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400 Bad Request");
      });
  });

  test("6e. 404: returns Not Found if no map questions found", () => {
    return request(app)
      .get("/api/map?category_id=999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404 Not Found");
      });
  });
});
