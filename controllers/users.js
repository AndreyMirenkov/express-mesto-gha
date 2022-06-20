const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}).then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userid).then((user) => {
    if (user === null) {
      const error = new Error('Запрашиваемый пользователь не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    res.send({ data: user });
  })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный формат данных ID пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.message.includes(': name')) {
          return res.status(400).send({ message: 'Переданы некорректные данные в поле name. Строка должна содержать от 2 до 30 символов' });
        }
        if (err.message.includes(': about')) {
          return res.status(400).send({ message: 'Переданы некорректные данные в поле about. Строка должна содержать от 2 до 30 символов' });
        }
        if (err.message.includes(': avatar')) {
          return res.status(400).send({ message: 'Переданы некорректные данные в поле avatar. Данные обязательны и должны быть строкой' });
        }
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (user === null) {
        const error = new Error('Запрашиваемый пользователь не найден');
        error.name = 'NotFoundError';
        throw error;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      } if (err.name === 'ValidationError') {
        if (err.message.includes(': name')) {
          return res.status(400).send({ message: 'Переданы некорректные данные в поле name. Строка должна содержать от 2 до 30 символов' });
        }
        if (err.message.includes(': about')) {
          return res.status(400).send({ message: 'Переданы некорректные данные в поле about. Строка должна содержать от 2 до 30 символов' });
        }
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный формат данных ID карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        const error = new Error('Запрашиваемый пользователь не найден');
        error.name = 'NotFoundError';
        throw error;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      } if (err.name === 'ValidationError') {
        if (err.message.includes(': avatar')) {
          return res.status(400).send({ message: 'Переданы некорректные данные в поле avatar. Данные обязательны и должны быть строкой' });
        }
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный формат данных ID карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
