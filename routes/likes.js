const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { likeItem } = require('../controllers/likes');
const { dislikeItem } = require('../controllers/likes');
const auth = require('../middlewares/auth');

router.put(
  '/:itemId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().alphanum().length(24),
      header: Joi.object().keys({}).unknown(true),
    }),
  }),
  likeItem,
);
router.delete(
  '/:itemId/likes',
  auth,
  celebrate({
    params: Joi.object().keys({
      itemId: Joi.string().alphanum().length(24),
      header: Joi.object().keys({}).unknown(true),
    }),
  }),
  dislikeItem,
);

module.exports = router;
