const router = require("express").Router();
const {
  getItems,
  createItems,
  removeItems,
} = require("../controllers/clothingItems");

router.use((req, res, next) => {
  if (res.status === 404) {
    res.send({ message: "Requested resource not found" });
  } else {
    next();
  }
});

router.get("/items", getItems);
router.post("/items", createItems);
router.delete("/items/:itemId", removeItems);

module.exports = router;
