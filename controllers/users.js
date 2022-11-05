const User = require("../models/user");

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
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
    .then((users) => {
      res.send({ data: users });
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
