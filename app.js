const express = require("express");
const router = require("./routes");
const app = express();
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/wtwr_db");

app.use("/", router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
