const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const { checkUser } = require("./middlewares/user");

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect("mongodb://localhost:27017/wtwr_db");

app.use(checkUser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(PORT);
