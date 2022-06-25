const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');

module.exports.getUsers = (req, res, next) => {
  User.find({}).then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userid).then((user) => {
    if (user === null) {
      throw new NotFoundError('Запрашиваемый пользователь не найден');
    }
    res.send({ data: user });
  })
    .catch(next);
};
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      if (!validator.isEmail(email)) {
        const error = new Error('Строка не является почтой');
        error.name = 'EmailValidationError';
        error.statusCode = 400;
        throw error;
      }
      return User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then(() => res.send({ message: 'Вы зарегистрировались' }))
    .catch(next);
};
module.exports.patchProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};
module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!validator.isEmail(email)) {
        const error = new Error('Строка не является почтой');
        error.name = 'EmailValidationError';
        error.statusCode = 400;
        throw error;
      }
      if (!user) {
        const error = new Error('Неправильные почта или пароль');
        error.name = 'NotFoundError';
        error.statusCode = 401;
        throw error;
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new Error('Неправильные почта или пароль');
            error.name = 'NotFoundError';
            error.statusCode = 401;
            throw error;
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });
      res.send({ message: 'Welcome' });
    })
    .catch(next);
};
module.exports.infoUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    res.status(200).send({ data: user });
  })
    .catch(next);
};
