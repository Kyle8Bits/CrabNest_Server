const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post: { type: String, required: true }, // Associated post
    author: { type: String, required: true }, // Comment author
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
}, { collection: 'comment'});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
