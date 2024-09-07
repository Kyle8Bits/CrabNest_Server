const express = require('express');
const { getFriends, deleteFriendship,  getFriendRequests , sendFriendRequest,acceptFriendRequest,declineFriendRequest} = require('../controllers/friendCotroller');

const router = express.Router();

router.get('/friends', getFriends);

router.delete('/friend-delete', deleteFriendship);

// router.get('/friendRequest', getFriendRequests);

router.get('/getRequest',getFriendRequests);

router.post('/sendRequest', sendFriendRequest);

router.post('/accept', acceptFriendRequest);

router.post('/decline', declineFriendRequest);

module.exports = router;