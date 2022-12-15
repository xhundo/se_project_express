const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getItems } = require('../controllers/clothingItems');
const { createClothingItem } = require('../controllers/clothingItems');
const { removeItems } = require('../controllers/clothingItems');
const auth = require('../middlewares/auth');
const { validateURL } = require('../utils/validator');

router.get('/', getItems);
router.post(
  '/',
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      weather: Joi.string().required(),
      imageUrl: Joi.string().required().custom(validateURL),
    }),
  }),
  createClothingItem,
);
router.delete(
  '/:id',
  auth,
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
      headers: Joi.object().keys({}).unknown(true),
    }),
  }),
  removeItems,
);

module.exports = router;
