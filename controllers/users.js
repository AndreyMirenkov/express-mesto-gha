const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const UniqueEmailError = require('../errors/unigue-email-error');

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
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      message: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch(() => {
      next(new UniqueEmailError('Этот Email уже используется'));
    });
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
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
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
