const router = require('express').Router();
const {
  getUsers, getUser, patchProfile, patchAvatar, infoUser,
} = require('../controllers/users');

router.get('/me', infoUser);
router.get('/', getUsers);
router.get('/:userid', getUser);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
