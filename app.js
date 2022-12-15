const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { login, createUser } = require('./controllers/users');
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const router = require('./routes');
const cors = require('cors');
const app = express();
const { PORT = 3001 } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateURL } = require('./utils/validator');
mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
app.use(requestLogger);
console.log(process.env.NODE_ENV);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(9),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(9),
      name: Joi.string().required().min(2),
      avatar: Joi.string().allow('').custom(validateURL),
    }),
  }),
  createUser,
);
app.use('/', router);
app.use(auth, (req, res, next) => {
  const statusCode = 404;

  const message = 'Requested resource not found';

  res.status(statusCode).send({ message });
  next();
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message:
      statusCode === 500 ? 'An error has occured on the server' : message,
  });
});

app.listen(PORT);
