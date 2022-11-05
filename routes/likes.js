const router = require('express').Router();
const { likeItem } = require('../controllers/likes');
const { dislikeItem } = require('../controllers/likes');

router.put('/:itemId/likes', likeItem);
router.delete('/:itemId/likes', dislikeItem);

module.exports = router;
