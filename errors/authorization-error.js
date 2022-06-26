class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'AuthorizationError';
  }
}
module.exports = AuthorizationError;
