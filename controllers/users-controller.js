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
  const {
    level_nature,
    level_territory,
    rating,
    avatar_url,
    quizz,
    correct_answers,
  } = req.body;

  if (
    Object.keys(req.body).length === 0 ||
    (level_nature !== undefined &&
      (typeof level_nature !== "string" || !level_nature.trim())) ||
    (level_territory !== undefined &&
      (typeof level_territory !== "string" || !level_territory.trim())) ||
    (avatar_url !== undefined &&
      (typeof avatar_url !== "string" || !avatar_url.trim())) ||
    (rating !== undefined && typeof rating !== "number") ||
    (quizz !== undefined && typeof quizz !== "number") ||
    (correct_answers !== undefined &&
      (typeof correct_answers !== "string" || !correct_answers.trim()))
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request!",
    });
  }

  const pendingUsernameCheck = selectUsersByUsername(username);
  const pendingUserPatch = patchUserByUsername(
    username,
    level_nature,
    level_territory,
    rating,
    avatar_url,
    quizz,
    correct_answers
  );

  Promise.all([pendingUserPatch, pendingUsernameCheck])
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
