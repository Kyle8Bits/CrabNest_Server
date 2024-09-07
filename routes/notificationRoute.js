// routes/NotificationRoute.js
const express = require('express');
const { fetchNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const router = express.Router();

// Middleware for user authentication can be added here if necessary
// Example: const { protect } = require('../middleware/authMiddleware');

// Route to get all notifications for a user
router.get('/getNotification',fetchNotifications);

// Route to mark a notification as read

module.exports = router;
