const router = require('express').Router();
const { getItems } = require('../controllers/clothingItems');
const { createClothingItem } = require('../controllers/clothingItems');
const { removeItems } = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');

router.get('/', getItems);
router.post('/', auth, createClothingItem);
router.delete('/:id', auth, removeItems);

module.exports = router;
