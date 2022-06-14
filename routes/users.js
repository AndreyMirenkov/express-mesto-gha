const router = require('express').Router();
const {
  getUsers, getUser, createUser, patchProfile, patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userid', getUser);
router.post('/', createUser);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
