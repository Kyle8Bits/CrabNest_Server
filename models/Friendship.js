const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    requester: { type: String, required: true }, // The username of the user who sent the friend request
    recipient: { type: String, required: true }, // The user who received the friend request
    status: { type: String, enum: ['Pending', 'Accepted'], default: 'Pending' }, // Friendship status
    createdAt: { type: Date, default: Date.now }, // When the friend request was created
    acceptedAt: { type: Date } // When the friendship was accepted (if applicable)
}, {collection: 'friendship'});

const Friendship = mongoose.model('friendship', FriendshipSchema);
module.exports = Friendship;

