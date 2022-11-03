const ClothingItems = require("../models/clothingItem");

module.exports.getItems = (req, res) => {
  ClothingItems.find({}).then((items) => res.send({ data: items }));
};

module.exports.createItems = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItems.create({ name, weather, imageUrl }).then((item) =>
    res.send({ data: item })
  );
};

module.exports.removeItems = (req, res) => {
  ClothingItems.findByIdAndRemove(req.params.id).then((item) => res.send(item));
};
