// controllers/NotificationController.js
const Notification = require('../models/Notification'); // Assuming your Notification model is in models folder
const User = require('../models/User');

const fetchNotifications = async (req, res) => {
    console.log(req.query);
    const { username } = req.query;  // Extract the username from query params
    try {
      const notifications = await Notification.find({ user: username });
       // Iterate through each notification and populate user avatar if applicable
       const enrichedNotifications = await Promise.all(notifications.map(async (notification) => {
        if (notification.type === 'FriendRequest' || notification.type === 'Reaction' || notification.type === 'FriendRequestAccepted') {
            // Fetch avatar for the user in the `from` field
            const user = await User.findOne({ username: notification.from });
            if (user) {
                return {
                    ...notification.toObject(),
                    avatar: user.avatar,  // Add the user's avatar
                };
            }
        }
        // Return the notification as-is if no user-based info is needed
        return notification.toObject();
    }));

    // Send enriched notifications with avatars
    res.status(200).json(enrichedNotifications);

    } catch (error) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
  };
  

  

module.exports = {
  fetchNotifications,
};
