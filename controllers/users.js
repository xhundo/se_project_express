const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { isValidUrl } = require('../utils/url');
const {
  badRequest,
  serverError,
  notFoundError,
  successOk,
  createdOk,
  conflictError,
  authError,
} = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

module.exports.getUser = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId) === false) {
    return res.status(badRequest).send({ message: 'Not valid user ID' });
  }
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
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
  const {
    name, avatar, email, password,
  } = req.body;
  if (!isValidUrl(avatar)) {
    return res.status(badRequest).send({ message: 'Not a valid URL' });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(conflictError)
        .send({ message: 'Email already exists' });
    }

    bcrypt.hash(password, 10).then(() => {
      User.create({
        name,
        avatar,
        email,
      })
        .then(() => res.status(createdOk).send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            res.status(conflictError).send({ message: 'Email already exist' });
          }
          if (err.name === 'ValidationError') {
            return res
              .status(badRequest)
              .send({ message: 'User validation failed' });
          }

          return res
            .status(serverError)
            .send({ message: 'An error has occured on the server' });
        });
    });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(() => res.status(authError).send({ message: 'Invalid email or password' }));
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(notFoundError).send({ message: 'User not found' });
      }
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

module.exports.updateUser = (req, res) => {
  const {
    name, avatar, email, password,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      avatar,
      email,
      password,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(notFoundError).send({ message: 'User not found' });
      }

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
