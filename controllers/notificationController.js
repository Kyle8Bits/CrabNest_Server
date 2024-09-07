// controllers/NotificationController.js
const Notification = require('../models/Notification'); // Assuming your Notification model is in models folder

const fetchNotifications = async (req, res) => {
    console.log(req.query);
    const { username } = req.query;  // Extract the username from query params
    try {
      const notifications = await Notification.find({ user: username });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  };
  

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating notification' });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
      const notificationId = req.params.id;
      const notification = await Notification.findByIdAndDelete(notificationId);
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting notification' });
    }
};
  

module.exports = {
  fetchNotifications,
  markAsRead,
  deleteNotification,
};
