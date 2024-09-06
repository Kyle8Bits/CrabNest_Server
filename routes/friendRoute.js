const express = require('express');
const { getFriends, deleteFriendship,  getFriendRequests , sendFriendRequest} = require('../controllers/friendCotroller');

const router = express.Router();

router.get('/friends', getFriends);

router.delete('/friend-delete', deleteFriendship);

// router.get('/friendRequest', getFriendRequests);

router.get('/getRequest',getFriendRequests);

router.post('/sendRequest', sendFriendRequest);


module.exports = router;