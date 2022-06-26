const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorization-error');

module.exports.auth = (req, res, next) => {
  const userToken = req.cookies.jwt;
  if (!userToken) {
    throw new AuthorizationError('Необходима авторизация');
  } else {
    let payload;
    try {
      payload = jwt.verify(userToken, 'some-secret-key');
    } catch (err) {
      throw new AuthorizationError('Необходима авторизация');
    }
    req.user = payload;
    next();
  }
};
