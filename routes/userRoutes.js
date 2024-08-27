// routes/userRoutes.js

const express = require('express');
const { loginUser, registerUser } = require('../controllers/userController');
const loggingMiddleware = require('../middleware/loggingMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const validateLoginData = require('../middleware/validateLogin');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loggingMiddleware, validateLoginData, authMiddleware, loginUser);

module.exports = router;
