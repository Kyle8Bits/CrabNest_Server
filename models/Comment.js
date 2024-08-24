const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Associated post
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Comment author
    content: { type: String, required: true }, // Comment content

    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction' }], // Reactions to the comment

    edited: { type: Boolean, default: false }, // Edit flag
    editHistory: [
        {
            content: String,
            editedAt: { type: Date, default: Date.now },
        }
    ], // Edit history of the comment

    createdAt: { type: Date, default: Date.now } // Comment creation timestamp
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
