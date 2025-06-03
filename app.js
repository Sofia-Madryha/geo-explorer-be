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

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    else if (err.code === "22P02") {
        res.status(400).send({msg: "Bad Request"})
    }
    else {
        next(err)
    }
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "500 Internal Server Error" });
});

module.exports = app;
