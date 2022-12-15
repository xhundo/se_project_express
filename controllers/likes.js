const ClothingItems = require('../models/clothingItem');
const { successOk } = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

module.exports.likeItem = (req, res, next) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item with ID not found'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid ID was passed'));
      }

      next(err);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Item with ID not found'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Invalid ID was passed'));
      }

      next(err);
    });
};
