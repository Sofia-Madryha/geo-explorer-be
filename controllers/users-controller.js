const {
  selectUsers,
  selectUsersByUsername,
  insertUser,
  patchUserByUsername,
} = require("../models/users-model");

exports.getUsers = (req, res) => {
  return selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUsersByUsername = (req, res, next) => {
  const { username } = req.params;

  return selectUsersByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const { username, avatar_url } = req.body;

  if (
    typeof username !== "string" ||
    typeof avatar_url !== "string" ||
    !username.trim() ||
    !avatar_url.trim()
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request!",
    });
  }

  return insertUser(username, avatar_url)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.updateUserByUsername = (req, res, next) => {
  const { username } = req.params;
  const { level_nature, level_territory } = req.body;

  return patchUserByUsername(username, level_nature, level_territory)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
