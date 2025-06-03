const express = require("express");
const apiRouter = require("./routes/api-router");

const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "404 Not Found" });
});

//psql errorhandler
app.use((err, req, res, next) => {
  if (err.code === "23505" || err.code === "23502") {
    if (err.constraint === "users_username_key") {
      res.status(409).send({ msg: "username already exists!" });
    } else {
      res.status(400).send({ msg: "Bad Request!" });
    }
  } else {
    next(err);
  }
});

//custom errorhandler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "500 Internal Server Error" });
});

module.exports = app;
