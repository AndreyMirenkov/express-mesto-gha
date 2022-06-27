const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const DeleteError = require('../errors/delete-error');

module.exports.getCard = (req, res, next) => {
  Card.find({}).then((cards) => res.send({ data: cards }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => {
    if (card === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    if (card.owner == req.user._id) {
      Card.findByIdAndRemove(card._id).then(() => {
        res.status(200).send({ message: 'Картинка удалена' });
      });
    } else {
      throw new DeleteError('Вы не можете удалить чужую карточку');
    }
  })
    .catch(next);
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (card === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    res.status(200).send({ message: card });
  })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (card === null) {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    }
    res.status(200).send({ message: card });
  })
    .catch(next);
};
