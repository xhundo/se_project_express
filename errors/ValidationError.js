const { badRequest } = require('./errors');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = badRequest;
  }
}

module.exports = ValidationError;
