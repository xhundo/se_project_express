const router = require('express').Router();
const userRouter = require('./users');
const clothingRouter = require('./clothingItems');
const likesRouter = require('./likes');

router.use((req, res, next) => {
  if (res.status === 404) {
    res.send({ message: 'Requested resource not found' });
  }
  next();
});

router.use('/users', userRouter);
router.use('/items', clothingRouter, likesRouter);

module.exports = router;
