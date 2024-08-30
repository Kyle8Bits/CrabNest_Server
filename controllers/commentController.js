const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Fetch all comments for a specific post
exports.getCommentsForPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'name avatar');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a comment to a specific post
exports.addCommentToPost = async (req, res) => {
    try {
        const comment = new Comment({
            post: req.params.postId,
            author: req.body.author, // Assuming author ID is passed in the request body
            content: req.body.content,
        });

        const savedComment = await comment.save();

        // Add the comment to the post's comments array
        await Post.findByIdAndUpdate(req.params.postId, {
            $push: { comments: savedComment._id }
        });

        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
