const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// Fetch all comments for a specific post
exports.getCommentsForPost = async (req, res) => {
    try {
        const { postId } = req.query;
        console.log(postId)
        const comments = await Comment.find({ post: postId }).populate('author', 'name avatar');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a comment to a specific post
exports.addCommentToPost = async (req, res) => {
    try {
        const {postId} = req.query;
        console.log(req.body);

        const comment = new Comment({
            post: postId,
            author: req.body.author, // Assuming author ID is passed in the request body
            authorUsername: req.body.authorUsername,
            content: req.body.content,
        });


        const savedComment = await comment.save();

        // Add the comment to the post's comments array
        await Post.findOneAndUpdate( {id: postId}, {
            $push: { comments: savedComment._id }
        });

        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteComment = async (req, res) => {
    try{
        const postId = req.query.postId
        const cmtId = req.query.commentId
        console.log("What ctrl get", postId, cmtId);

        const deleteCmt = await Comment.findByIdAndDelete(cmtId)

        if(!deleteCmt){
            console.log('Cmt not found for deletion:', cmtId);
            return res.status(404).json({ message: 'Cmt not found' });
        }
        const cmtObjectId = new mongoose.Types.ObjectId(cmtId);
        
        const updatePost = await Post.findOneAndUpdate(
            { id: postId },
            { $pull: { comments: cmtObjectId  } }
        );
        
        if (!updatePost) {
            console.log('Post not found or update failed for postId:', postId);
            return res.status(404).json({ message: 'Post not found or update failed' });
        }
        
        return res.status(200).json({ message: 'Comment deleted successfully' });
        
    }
    catch(err){
        console.log(err)
    }
}

exports.editComment = async (req, res)=>{
    try{
        const commentId = req.body.params.commentId;
        const newContent =  req.body.params.newContent;

        const cmtObjectId = new mongoose.Types.ObjectId(commentId);
        const updatedComment = await Comment.findByIdAndUpdate(
            cmtObjectId,
            { content: newContent },
            { new: true } // This option returns the updated document
        );

        if (!updatedComment) {
            return res.status(404).send({ message: 'Comment not found' });
        }
    
        res.status(200).send(updatedComment);
        
    } catch (err) {
        res.status(500).send({ message: 'Error updating comment', error: err });
    }
}
