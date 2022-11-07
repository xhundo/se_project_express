const ClothingItems = require("../models/clothingItem");
const { isValidUrl } = require("../utils/url");
const mongoose = require("mongoose");

module.exports.getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.send([{ data: items }]))
    .catch((err) => {
      const ERROR_CODE = 500;
      if (err.name === "InternalServerError") {
        res
          .status(ERROR_CODE)
          .send({ message: "An error has occured on the server" });
      }
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  if (!isValidUrl(imageUrl)) {
    return res.status(400).send({ message: `Url invalid` });
  } else if (!weather) {
    return res.status(400).send({ message: `Weather is required` });
  } else {
    ClothingItems.create({
      name,
      weather: weather.toLowerCase(),
      imageUrl: imageUrl.toString(),
      owner,
    })
      .then((item) => {
        return res.status(201).send({ data: item });
      })
      .catch((err) => {
        const ERROR_CODE = 400;
        if (err.name === "ValidationError") {
          return res
            .status(ERROR_CODE)
            .send({ message: "Item validation failed" });
        }
      });
  }
};

module.exports.removeItems = (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.itemId) === false) {
    return res.status(400).send({ message: `Not valid ID` });
  } else {
    ClothingItems.findByIdAndRemove(req.params.itemId)
      .orFail(() => {
        return res.status(404).send({ message: "Item ID not found" });
      })
      .then((item) => {
        return res.status(200).send({ data: item });
      })
      .catch((err) => {
        const ERROR_CODE = 404;
        if (err.name === "DocumentNotFoundError") {
          return res.status(ERROR_CODE).send({ message: "Item ID not found" });
        }
      });
  }
};
