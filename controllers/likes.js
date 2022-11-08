const ClothingItems = require('../models/clothingItem');
const {
  badRequest,
  serverError,
  notFoundError,
  successOk,
} = require('../utils/errors');

module.exports.likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(notFoundError)
          .send({ message: 'Item with ID not found' });
      } else if (err.name === 'CastError') {
        return res
          .status(badRequest)
          .send({ message: 'Invalid ID was passed' });
      } else {
        return res
          .status(serverError)
          .send({ message: 'An error has occured on the server' });
      }
    });
};

module.exports.dislikeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((user) => res.status(successOk).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(notFoundError)
          .send({ message: 'Item with ID not found' });
      } else if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid ID was passed' });
      } else {
        return res
          .status(serverError)
          .send({ message: 'An error has occured on the server' });
      }
    });
};
