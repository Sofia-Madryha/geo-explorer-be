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
  // test("200-responds with an array of multi-choice questions and answers", () => {
  //   return request(app)
  //     .get("/api/multichoice-qa")
  //     .expect(200)
  //     .then(({ body: { multichoice_qa } }) => {
  //       expect(multichoice_qa.length).toBe(23);
  //       multichoice_qa.forEach((item) => {
  //         expect(item).toMatchObject({
  //           question_mc_id: expect.any(Number),
  //           continent: expect.any(String),
  //           sub_category_id: expect.any(Number),
  //           level: expect.any(String),
  //           question_text: expect.any(String),
  //           answer_mc_id: expect.any(Number),
  //           multiple_choice_text: expect.any(String),
  //           correct_answer: expect.any(String),
  //         });
  //       });
  //     });
  // });
  test("200-responds with an array of multi-choice questions and answers", () => {
    return request(app)
      .get(
        "/api/multichoice-qa?level=Beginner&&continent=asia&&category_id=1"
      )
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
      .get(
        "/api/multichoice-qa?level=potato&&continent=asia&&category_id=1"
      )
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
          level_nature: "beginner",
          level_territory: "beginner",
          rating: 0,
          avatar_url: "https://avatar.iran.liara.run/public/23",
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
          level_nature: "intermediate",
          level_territory: "intermediate",
          rating: 60,
          avatar_url: "https://avatar.iran.liara.run/public/77",
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
    const patchObj = { level_nature: "intermediate" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "intermediate",
          level_territory: "intermediate",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
        });
      });
  });

  test("2 200: Respond with an updated user object with updated level_territory", () => {
    const patchObj = { level_territory: "advance" };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "beginner",
          level_territory: "advance",
          rating: 15,
          avatar_url: "https://avatar.iran.liara.run/public/12",
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
          level_nature: "beginner",
          level_territory: "intermediate",
          rating: 100,
          avatar_url: "https://avatar.iran.liara.run/public/12",
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
          level_nature: "beginner",
          level_territory: "intermediate",
          rating: 15,
          avatar_url: "newUrl",
        });
      });
  });

  test("5 200: Respond with an updated user object with updated level_nature and rating", () => {
    const patchObj = { level_nature: "intermediate", rating: 50 };

    return request(app)
      .patch("/api/users/mike_w")
      .send(patchObj)
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          user_id: 4,
          username: "mike_w",
          level_nature: "intermediate",
          level_territory: "intermediate",
          rating: 50,
          avatar_url: "https://avatar.iran.liara.run/public/12",
        });
      });
  });

  test("6 404: Respond with username Not Found! msg when trying to update user with username not in database", () => {
    const patchObj = { level_nature: "intermediate", rating: 50 };

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
});
