const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who sent the friend request
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user who received the friend request
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // Friendship status
    createdAt: { type: Date, default: Date.now }, // When the friend request was created
    acceptedAt: { type: Date } // When the friendship was accepted (if applicable)
});

const Friendship = mongoose.model('Friendship', FriendshipSchema);
module.exports = Friendship;

