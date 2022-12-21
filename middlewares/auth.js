const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthError('Authorization required'));
  }
  {
    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      next(new AuthError('Authorization required'));
    }

    req.user = payload;

    next();
  }
};
