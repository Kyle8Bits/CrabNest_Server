const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Group name
    description: { type: String }, // Group description
    isPrivate: { type: Boolean, default: false }, // Group visibility

    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Group members
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Group admins
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Posts in the group

    waitlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    createdAt: { type: Date, default: Date.now } // Group creation timestamp
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
