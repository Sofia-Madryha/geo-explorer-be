const {
  getUsers,
  getUsersByUsername,
  postUser,
  updateUserByUsername,
} = require("../controllers/users-controller");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers).post("/", postUser);

usersRouter.route("/:username").get(getUsersByUsername).patch(updateUserByUsername);

module.exports = usersRouter;
