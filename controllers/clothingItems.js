const mongoose = require('mongoose');
const ClothingItems = require('../models/clothingItem');
const { isValidUrl } = require('../utils/url');
const {
  badRequest,
  serverError,
  notFoundError,
  createdOk,
  forbiddenError,
} = require('../errors/errors');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getItems = (req, res, next) => {
  ClothingItems.find({})
    .then((items) => res.send([{ data: items }]))
    .catch((err) => next(err));
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  // if (!isValidUrl(imageUrl)) {
  //   return res.status(badRequest).send({ message: 'Url invalid' });
  // }
  if (!weather) {
    throw new ValidationError('Weather is required');
  }
  ClothingItems.create({
    name,
    weather: weather.toLowerCase(),
    imageUrl: imageUrl.toString(),
    owner,
  })
    .then((item) => res.status(createdOk).send({ data: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Item validation failed'));
      }

      next(err);
    });
};

module.exports.removeItems = (req, res, next) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(req.params.id) === false) {
    throw new ValidationError('Not valid ID');
  }
  ClothingItems.findById(id)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(forbiddenError)
          .send({ message: 'User not authorized' });
      }
      return item.remove().then(() => res.send({ data: item }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item ID not found'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid ID was passed'));
      }
      next(err);
    });
};
