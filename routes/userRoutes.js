// routes/userRoutes.js

const express = require('express');
const { loginUser, registerUser, updateUserProfile, getUser, searchUsers, changePassword} = require('../controllers/userController');
const loggingMiddleware = require('../middleware/loggingMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const validateLoginData = require('../middleware/validateLogin');

const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', registerUser);
router.post('/change_password', changePassword);
router.post('/login', loggingMiddleware, validateLoginData, authMiddleware, loginUser);
router.put('/profile', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), updateUserProfile);
router.get('/:username', getUser)
router.get('/users/search', searchUsers);


module.exports = router;
