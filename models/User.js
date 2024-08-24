const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Unique username
    fullName: { type: String, required: true }, // Full name of the user
    email: { type: String, required: true, unique: true }, // Unique email address
    phone: { type: String, unique: true }, // Unique phone number (optional)
    password: { type: String, required: true }, // Hashed password

    bio: { type: String }, // Short biography or description
    info: [
        {
            role: { type: String, enum: ['work', 'study'], required: true }, // Role: 'work' or 'study'
            place: { type: String, required: true } // Associated place (e.g., company or school)
        }
    ],

    sharedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Posts shared by the user

    isAdmin: { type: Boolean, default: false }, // Admin flag
    isSuspended: { type: Boolean, default: false }, // Suspension flag

    createdAt: { type: Date, default: Date.now }, // Account creation timestamp
    updatedAt: { type: Date, default: Date.now } // Profile last updated timestamp
});

UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
