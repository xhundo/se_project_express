const mongoose = require('mongoose');
const User = require('../models/user');
const { isValidUrl } = require('../utils/url');
const {
  badRequest,
  serverError,
  notFoundError,
  successOk,
  createdOk,
} = require('../utils/errors');

module.exports.getUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId) === false) {
    return res.status(badRequest).send({ message: 'Not valid user ID' });
  }
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(notFoundError)
          .send({ message: 'Requested resource not found' });
      }
      if (err.name === 'CastError') {
        return res
          .status(badRequest)
          .send({ message: 'Invalid ID was passed' });
      }

      return res
        .status(serverError)
        .send({ message: 'An error has occured on the server' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(successOk).send([{ data: users }]))
    .catch(() => res
      .status(serverError)
      .send({ message: 'An error has occured on the server' }));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!isValidUrl(avatar)) {
    return res.status(badRequest).send({ message: 'Not a valid URL' });
  }
  User.create({ name, avatar })
    .then((user) => res.status(createdOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(badRequest)
          .send({ message: 'User validation failed' });
      }

      return res
        .status(serverError)
        .send({ message: 'An error has occured on the server' });
    });
};
