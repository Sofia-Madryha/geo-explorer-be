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
      username: "",
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

  test("2 404-Respond with username Not Found! when provided username not in database", () => {
    return request(app)
      .get("/api/users/NotAUsername")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("username Not Found!");
      });
  });
});

describe.only(" PATCH /api/users/:username", () => {
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
});
