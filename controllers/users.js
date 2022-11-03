const User = require("../models/user");

module.exports.getUser = (req, res) => {
  User.findById(req.params.id).then((user) => {
    res.send({ data: user });
  });
};

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send({ data: users });
  });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar }).then((user) => res.send({ data: user }));
};
