const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers, getUser, patchProfile, patchAvatar, infoUser,
} = require('../controllers/users');

router.get('/me', infoUser);
router.get('/', getUsers);
router.get('/:userid', celebrate({
  params: Joi.object().keys({
    userid: Joi.string().alphanum().length(24),
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
    avatar: Joi.string().regex(/^https?:\/\/(\w|-|\.|~|:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=)+(?:<>)*\b$/),
  }),
}), patchAvatar);

module.exports = router;
