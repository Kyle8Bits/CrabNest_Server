const express = require('express');
const { getFriends, deleteFriendship } = require('../controllers/friendCotroller');

const router = express.Router();

router.get('/friends', getFriends);

router.delete('/friend-delete', deleteFriendship);

module.exports = router;