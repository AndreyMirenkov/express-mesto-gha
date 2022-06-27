class DataAuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'DataAuthError';
  }
}
module.exports = DataAuthError;
