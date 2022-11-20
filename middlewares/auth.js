const jwt = require('jsonwebtoken');
const { authError } = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(authError).send({ message: 'Authorization required' });
  }
  {
    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(authError).send({ message: 'Authorization required' });
    }

    req.user = payload;

    next();
  }
};
