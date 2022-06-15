const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({}).then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные в методы создания карточки' });
      } return res.status(500).send({ message: err.message });
    });
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).then((card) => {
    if (card === null) {
      const error = new Error('Запрашиваемая карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }
    res.status(200).send({ message: 'Картинка удалена' });
  })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный формат данных ID карточки' });
      } return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (card === null) {
      const error = new Error('Запрашиваемая карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }
    res.status(201).send({ message: card });
  })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный формат данных ID карточки' });
      } return res.status(500).send({ message: err.name });
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (card === null) {
      const error = new Error('Запрашиваемая карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }
    res.status(201).send({ message: card });
  })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return res.status(404).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Неправильный формат данных ID карточки' });
      } return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};
