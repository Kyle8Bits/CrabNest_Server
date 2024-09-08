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
    removeAdmin,
    acceptJoiningRequest,
    rejectJoiningRequest,
    getPostForGroup,
    getMembers,
    kickMember}
= require('../controllers/groupController');

const router = express.Router();
const upload = require('../middleware/multer');


router.post('/createGroup', createGroup);

router.get('/getGroups', getGroupForUser);

router.get('/getGroupById', getGroupById);

router.get('/getWaitlist', getWaitlist);

router.get('/getAdmins', getAdmins);

router.post('/addAdmin', addAdmin);

router.post('/removeAdmin', removeAdmin);

router.get('/getCommunities', getCommunities);

router.post('/editBanner',upload.fields([{ name: 'banner', maxCount: 1 }]) , editBanner);

router.post('/joinGroup', joinGroup);

router.post('/leaveGroup', leaveGroup);

router.post('/cancelJoin', cancelJoin);

router.post('/acceptJoiningRequest', acceptJoiningRequest);

router.post('/rejectJoiningRequest', rejectJoiningRequest);

router.get('/getPostForGroup', getPostForGroup);

router.get('/getMember', getMembers);

router.post('/kickMember', kickMember);

module.exports = router;
