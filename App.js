const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(\w|-|\.|~|:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=)+\b$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message, name } = err;

  if (name === 'CastError') {
    return res
      .status(400)
      .send({ message: 'Неправильный формат данных ID' });
  }

  if (err.name === 'ValidationError') {
    if (err.message.includes(': name')) {
      return res.status(400).send({ message: 'Переданы некорректные данные в поле name. Строка должна содержать от 2 до 30 символов' });
    }
    if (err.message.includes(': about')) {
      return res.status(400).send({ message: 'Переданы некорректные данные в поле about. Строка должна содержать от 2 до 30 символов' });
    }
    if (err.message.includes(': avatar')) {
      return res.status(400).send({ message: message === '' ? 'Переданы некорректные данные в поле avatar. Данные обязательны и должны быть строкой' : message });
    }
    if (err.message.includes(': link')) {
      return res.status(400).send({ message: message === '' ? 'Переданы некорректные данные в поле link. Данные обязательны и должны быть строкой' : message });
    }
  }

  if (err.code === 11000) {
    return res
      .status(409)
      .send({ message: 'Этот Email уже используется' });
  }

  return res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port: ${PORT}`);
});
