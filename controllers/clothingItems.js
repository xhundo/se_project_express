const mongoose = require('mongoose');
const ClothingItems = require('../models/clothingItem');
const { isValidUrl } = require('../utils/url');
const {
  badRequest,
  serverError,
  notFoundError,
  createdOk,
  forbiddenError,
} = require('../utils/errors');

module.exports.getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send([{ data: items }]))
    .catch(() => {
      res
        .status(serverError)
        .send({ message: 'An error has occured on the server' });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  if (!isValidUrl(imageUrl)) {
    return res.status(badRequest).send({ message: 'Url invalid' });
  }
  if (!weather) {
    return res.status(badRequest).send({ message: 'Weather is required' });
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
        return res
          .status(badRequest)
          .send({ message: 'Item validation failed' });
      }

      return res
        .status(serverError)
        .send({ message: 'An error has occured on the server' });
    });
};

module.exports.removeItems = (req, res) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(req.params.itemId) === false) {
    return res.status(badRequest).send({ message: 'Not valid ID' });
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
        return res.status(notFoundError).send({ message: 'Item ID not found' });
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
