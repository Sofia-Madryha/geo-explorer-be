const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "404 Not Found" });
});

module.exports = app;
