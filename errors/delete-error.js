class DeleteError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.name = 'NotDeleteErrorFoundError';
  }
}
module.exports = DeleteError;
