const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Unique username
    fullName: { type: String, required: true }, // Full name of the user
    email: { type: String, required: true, unique: true }, // Unique email address
    phone: { type: String, unique: true }, // Unique phone number (optional)
    password: { type: String, required: true }, // Hashed password

    bio: { type: String }, // Short biography or description
    avatar: { type: String }, // URL or path to the user's avatar image
    info: [
        {
            role: { type: String, enum: ['Work at', 'Study at'], required: true }, // Role: 'work' or 'study'
            place: { type: String, required: true } // Associated place (e.g., company or school)
        }
    ],
    banner:{type: String},

    sharedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], // Posts shared by the user

    isAdmin: { type: Boolean, default: false }, // Admin flag
    isSuspended: { type: Boolean, default: false }, // Suspension flag

    createdAt: { type: Date, default: Date.now }, // Account creation timestamp
    updatedAt: { type: Date, default: Date.now } // Profile last updated timestamp
},{ collection: 'user' });

UserSchema.pre('save', async function(next) {
    const user = this;

    // Hash the password if it has been modified (or is new)
    if (user.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            user.password = await bcrypt.hash(user.password, salt); // Hash the password
        } catch (err) {
            return next(err);
        }
    }
    next();
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
