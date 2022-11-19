const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const router = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('signup', createUser);
app.use('/', router);
app.use((req, res, next) => {
  const statusCode = 404;

  const message = 'Requested resource not found';

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
