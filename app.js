const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://localhost:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "63659e74a3429fb348b86dbe",
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(PORT);
