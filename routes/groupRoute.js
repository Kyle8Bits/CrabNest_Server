const express = require('express');
const { createGroup, getGroupForUser } = require('../controllers/groupController');
const router = express.Router();

router.post('/createGroup', createGroup);

router.get('/getGroups', getGroupForUser);

module.exports = router;
