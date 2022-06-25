const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const userToken = req.cookies.jwt;
  if (!userToken) {
    const error = new Error('Необходима авторизация');
    error.name = 'AuthorizationError';
    error.statusCode = 401;
    throw error;
  } else {
    let payload;
    try { payload = jwt.verify(userToken, 'some-secret-key'); } catch (err) {
      const error = new Error('Необходима авторизация');
      error.name = 'AuthorizationError';
      error.statusCode = 401;
      throw error;
    }
    req.user = payload;
    next();
  }
};
