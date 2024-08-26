const express = require('express');
const { getFriends } = require('../controllers/friendCotroller');

const router = express.Router();

router.get('/friends', getFriends);

module.exports = router;