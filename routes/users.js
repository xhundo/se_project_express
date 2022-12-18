const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser } = require('../controllers/users');

const { updateUser } = require('../controllers/users');

const { validateURL } = require('../utils/validator');

router.get('/me', getCurrentUser);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      avatar: Joi.string().allow('').custom(validateURL),
    }),
  }),
  updateUser,
);

module.exports = router;
