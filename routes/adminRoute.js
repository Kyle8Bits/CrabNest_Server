const express = require('express');
const { getBanned, getActive ,banUser, unBanUser, getGroupReq, decideGrougReq} = require('../controllers/adminController')

const router = express.Router();

router.get('/bannedUsers', getBanned)
router.get ('/activeUsers', getActive)
router.get('/groupRequest', getGroupReq) 


router.post('/ban', banUser)
router.post('/unban', unBanUser)
router.post('/decide', decideGrougReq)

module.exports = router;