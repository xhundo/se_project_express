const User = require("../models/user");
const mongoose = require("mongoose");

module.exports.getUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId) === false) {
    return res.status(400).send({ message: `Not valid user ID` });
  } else {
    User.findById(req.params.userId)
      .orFail()
      .then((user) => {
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        console.log(err);
        const ERROR_CODE = 404;
        if (err.name === "DocumentNotFoundError") {
          return res
            .status(ERROR_CODE)
            .send({ message: "Requested resource not found" });
        }
      });
  }
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.status(200).send([{ data: users }]);
    })
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
};
