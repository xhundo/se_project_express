const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const { isValidUrl } = require('../utils/url');
const { successOk, createdOk } = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
// const { JWT_SECRET } = require('../utils/config');
const AuthError = require('../errors/AuthError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUser = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.userId) === false) {
    throw new ConflictError('Not valid user ID');
  }
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Requested resource not found'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid ID was passed'));
      }

      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(successOk).send([{ data: users }]))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  // if (!isValidUrl(avatar)) {
  //   return res.status(badRequest).send({ message: 'Not a valid URL' });
  // }
  return User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError('Email already exist'));
    }

    bcrypt.hash(password, 10).then((hash) => {
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
        .then(() => res.status(createdOk).send({ name, avatar, email }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Email already exists'));
          }
          if (err.name === 'ValidationError') {
            next(new ValidationError('User validation failed'));
          }
          next(err);
        });
    });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev_secret',
        {
          expiresIn: '7d',
        },
      );

      res.send({ token });
    })
    .catch((err) => next(new AuthError(err.message)));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(successOk).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('User not found'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('User validation failed'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('User not found'));
      }

      if (err.name === 'ValidationError') {
        next(new ValidationError('User validation failed'));
      }
      next(err);
    });
};
