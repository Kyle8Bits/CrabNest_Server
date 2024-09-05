const express = require('express');
const { createGroup, getGroupForUser, getGroupById, getAdmins, editBanner} = require('../controllers/groupController');
const router = express.Router();
const upload = require('../middleware/multer');


router.post('/createGroup', createGroup);

router.get('/getGroups', getGroupForUser);

router.get('/getGroupById', getGroupById);

router.get('/getAdmins', getAdmins);

router.post('/editBanner',upload.fields([{ name: 'banner', maxCount: 1 }]) , editBanner);

module.exports = router;
