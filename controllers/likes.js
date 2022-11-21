const ClothingItems = require('../models/clothingItem');
const {
  badRequest,
  serverError,
  notFoundError,
  successOk,
} = require('../utils/errors');

module.exports.likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(notFoundError)
          .send({ message: 'Item with ID not found' });
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

module.exports.dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(notFoundError)
          .send({ message: 'Item with ID not found' });
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
