const router = require('express').Router();
const { getUsers } = require('../controllers/users');
const { getUser } = require('../controllers/users');
const { createUser } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);

module.exports = router;
