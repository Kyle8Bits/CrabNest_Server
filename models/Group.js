const mongoose = require('mongoose');


function generateIdWithDate() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD format
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string of 8 characters
    return `group-${date}-${randomString}`;
}


const GroupSchema = new mongoose.Schema({
    id: { type: String, default: generateIdWithDate, require: true },
    name: { type: String, required: true }, // Group name
    description: { type: String }, // Group description
    isPrivate: { type: Boolean, default: false }, // Group visibility

    banner: { type: String }, // URL or path to the group's banner image
    members: {
        type: [String],
        default: function() {
            return this.admins; // Set default members to be the same as admins
        }
    }, // Group members
    admins: [{type:String}], // Group admins
    posts: [{ type:String, default: null}], // Posts in the group
    status:{type:String, enum: ['Approve', 'Pending', 'Reject'], required: true, default: 'Pending'}, // Group status
    waitlist: [{ type:String, default:null }], // Users waiting to join the group

    createdAt: { type: Date, default: Date.now } // Group creation timestamp
},{collection:'group'});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
