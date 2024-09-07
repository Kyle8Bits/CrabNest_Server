const mongoose = require('mongoose');

function generateIdWithDate() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD format
    const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string of 8 characters
    return `${date}-${randomString}`;
}


const PostSchema = new mongoose.Schema({
    id: { type: String, default: generateIdWithDate, require: true },
    author: { type: String, require: true }, // Post author
    content: { type: String}, // Post content
    images: [String], // Array of image URLs (optional)
    visibility: { type: String, enum: ['Public', 'Friend', 'Group'], default: 'Public' }, // Post visibility
    group: { type: String, default: null }, // Associated group (if applicable)
    
    reactions: {type: Number, default: 0},  
    reactBy: [{ type: String }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Comments on the post
    edited: { type: Boolean, default: false }, // Edit flag
    editHistory: [
        {
            content: String,
            images: [String],
            editedAt: { type: Date, default: Date.now },
        }
    ], // Edit history of the post

    createdAt: { type: String} // Post creation timestamp
},{collection: 'post'});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
