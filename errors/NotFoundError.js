const { notFoundError } = require('./errors');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = notFoundError;
  }

  //   customNotFoundError(err, res) {
  //     const { message } = err;

  //     if (err instanceof NotFoundError) {
  //       res
  //         .status(this.statusCode)
  //         .send({ message: 'Requested resource not found' });
  //     } else {
  //       res.status(500).send({
  //         message,
  //       });
  //     }
  //   }
}

module.exports = NotFoundError;
