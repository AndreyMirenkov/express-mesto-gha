class UniqueEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.name = 'UniqueEmailError';
  }
}
module.exports = UniqueEmailError;
