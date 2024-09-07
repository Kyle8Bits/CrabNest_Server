const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: String, required: true }, // User receiving the notification

    type: { type: String, enum: ['FriendRequest', 'Reaction', 'GroupApproval'], required: true }, // Notification type
    message: { type: String, required: true }, // Notification message

    from: { type: String, required: true },


    createdAt: { type: Date, default: Date.now } // Notification creation timestamp
},{collection: 'notification'});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
