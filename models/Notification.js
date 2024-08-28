const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User receiving the notification

    type: { type: String, enum: ['FriendRequest', 'Reaction', 'GroupApproval', 'Comment'], required: true }, // Notification type
    message: { type: String, required: true }, // Notification message

    read: { type: Boolean, default: false }, // Read status

    createdAt: { type: Date, default: Date.now } // Notification creation timestamp
},{collection: 'notification'});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
