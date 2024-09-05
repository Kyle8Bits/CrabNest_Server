const express = require('express');
const { createGroup, 
    getGroupForUser, 
    joinGroup,
    leaveGroup,
    cancelJoin,
    getCommunities,
    getGroupById, 
    getAdmins,
    editBanner, 
    addAdmin, 
    getWaitlist,
    removeAdmin} 
= require('../controllers/groupController');

const router = express.Router();
const upload = require('../middleware/multer');


router.post('/createGroup', createGroup);

router.get('/getGroups', getGroupForUser);

router.get('/getGroupById', getGroupById);

router.get('/getAdmins', getAdmins);

router.post('/addAdmin', addAdmin);

router.post('/removeAdmin', removeAdmin);

router.get('/getCommunities', getCommunities);

router.post('/editBanner',upload.fields([{ name: 'banner', maxCount: 1 }]) , editBanner);

router.post('/joinGroup', joinGroup);

router.post('/leaveGroup', leaveGroup);

router.post('/cancelJoin', cancelJoin)

module.exports = router;
