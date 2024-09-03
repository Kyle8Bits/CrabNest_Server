const mongoose = require('mongoose');

const GroupRequestSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Group name
    description: { type: String }, // Group description    adminName: String,
    isPrivate: { type: Boolean, default: false }, // Group visibility

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Other fields...
});

const GroupRequest = mongoose.model('GroupRequest', GroupRequestSchema, 'grouprequest');
module.exports = GroupRequest;
