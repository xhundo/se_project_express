const ClothingItems = require("../models/clothingItem");

module.exports.likeItem = (req, res) => {
  ClothingItems.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Item with ID not found" });
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
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE)
          .send({ message: "Item with ID not found" });
      }
    });
};
