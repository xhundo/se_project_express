const router = require('express').Router();
const userRouter = require('./users');
const clothingRouter = require('./clothingItems');
const likesRouter = require('./likes');
const auth = require('../middlewares/auth');

router.use('/users', auth, userRouter);
router.use('/items', clothingRouter, likesRouter);

module.exports = router;
