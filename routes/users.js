const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers, getUser, patchProfile, patchAvatar, infoUser,
} = require('../controllers/users');
const regex = require('../helpers/regex');

router.get('/me', infoUser);
router.get('/', getUsers);
router.get('/:userid', celebrate({
  params: Joi.object().keys({
    userid: Joi.string().hex().length(24),
  }),
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
}), patchAvatar);

module.exports = router;
