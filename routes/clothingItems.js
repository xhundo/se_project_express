const router = require('express').Router();
const { getItems } = require('../controllers/clothingItems');
const { createClothingItem } = require('../controllers/clothingItems');
const { removeItems } = require('../controllers/clothingItems');

router.get('/', getItems);
router.post('/', createClothingItem);
router.delete('/:itemId', removeItems);

module.exports = router;
