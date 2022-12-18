const notFoundError = 404;
const serverError = 500;
const badRequest = 400;
const successOk = 200;
const createdOk = 201;
const conflictError = 409;
const authError = 401;
const forbiddenError = 403;

const errorHandle = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res.status(statusCode).send({
    message:
      statusCode === 500 ? 'An error has occured on the server' : message,
  });
};

module.exports = {
  notFoundError,
  serverError,
  badRequest,
  successOk,
  createdOk,
  conflictError,
  authError,
  forbiddenError,
  errorHandle,
};
