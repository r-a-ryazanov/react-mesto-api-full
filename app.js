/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cardsRouter = require('./routes/cards.js');
const usersRouter = require('./routes/users.js');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

const { PORT = 3001 } = process.env;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// ----------Роутинг для пользователей-------------------
app.use('/', usersRouter);
// ----------Роутинг для карточек-------------------
app.use('/cards', cardsRouter);

// ----------Обработка запросов к несуществующим ресурсам-------------------
app.all('/*', (req, res, next) => {
  const err = new Error('Запрашиваемый ресурс не найден');
  err.statusCode = 404;
  next(err);
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log();
});
