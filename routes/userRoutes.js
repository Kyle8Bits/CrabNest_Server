// routes/userRoutes.js

const express = require('express');
const { loginUser, registerUser, updateUserProfile } = require('../controllers/userController');
const loggingMiddleware = require('../middleware/loggingMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const validateLoginData = require('../middleware/validateLogin');

const upload = require('../middleware/multer');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loggingMiddleware, validateLoginData, authMiddleware, loginUser);
router.put('/profile',upload.single('avatar'), updateUserProfile);

module.exports = router;
