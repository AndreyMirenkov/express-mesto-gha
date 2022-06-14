const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({}).then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);
  Card.create({ name, link, owner: req.user._id }).then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).then(() => res.status(200).send({ message: 'Картинка удалена' }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};
