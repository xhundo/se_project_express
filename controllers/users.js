const mongoose = require("mongoose");
const User = require("../models/user");
const { isValidUrl } = require("../utils/url");

module.exports.getUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId) === false) {
    return res.status(400).send({ message: "Not valid user ID" });
  }
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.log(err);
      const ERROR_CODE = 404;
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Requested resource not found" });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send([{ data: users }]))
    .catch((err) => {
      const ERROR_CODE = 500;
      if (err.name === "InternalServerError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "An error has occured on the server" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!isValidUrl(avatar)) {
    return res.status(400).send({ message: `Not a valid URL` });
  } else {
    User.create({ name, avatar })
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        const ERROR_CODE = 400;
        if (err.name === "ValidationError") {
          return res
            .status(ERROR_CODE)
            .send({ message: "User validation failed" });
        }
      });
  }
};