const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: { type: String, require: true }, // Post author
    content: { type: String, required: true }, // Post content
    images: [String], // Array of image URLs (optional)
    visibility: { type: String, enum: ['Public', 'Friend', 'Group'], default: 'Public' }, // Post visibility
    group: { type: String, default: null }, // Associated group (if applicable)
    
    reactions: {type: Number, default: 0},  
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Comments on the post

    edited: { type: Boolean, default: false }, // Edit flag
    editHistory: [
        {
            content: String,
            editedAt: { type: Date, default: Date.now },
        }
    ], // Edit history of the post

    createdAt: { type: String} // Post creation timestamp
},{collection: 'post'});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;
