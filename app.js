const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors, celebrate, Joi } = require('celebrate');
const cors = require('cors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const router = require('./routes');

const app = express();

const { PORT = 3000 } = process.env;
const { errorHandle } = require('./errors/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateURL } = require('./utils/validator');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.set('trust proxy');

app.use(limiter);

const NotFoundError = require('./errors/NotFoundError');

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(cors());
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required().min(9),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .required()
        .email({ tlds: { allow: false } }),
      password: Joi.string().required().min(9),
      name: Joi.string().min(2),
      avatar: Joi.string().allow('').custom(validateURL),
    }),
  }),
  createUser,
);

app.use('/', router);

app.use(auth, (next) => {
  NotFoundError('Requested resource not found');
  next();
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  errorHandle(err, req, res, next);
});

app.listen(PORT);
