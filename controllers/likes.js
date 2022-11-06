const ClothingItems = require("../models/clothingItem");

module.exports.likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail()
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Item with ID not found" });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Item with ID not found" });
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
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 404;
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Item with ID not found" });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Item with ID not found" });
      }
    });
};
