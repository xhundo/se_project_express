const router = require('express').Router();
const userRouter = require('./users');
const clothingRouter = require('./clothingItems');
const likesRouter = require('./likes');
const auth = require('../middlewares/auth');

router.use('/users', userRouter);
router.use('/items', auth, clothingRouter, likesRouter);

module.exports = router;
