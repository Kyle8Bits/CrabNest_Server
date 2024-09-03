const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Route to get all comments for a specific post
router.get('/posts/:postId', commentController.getCommentsForPost);

// Route to add a comment to a specific post
router.post('/posts/:postId', commentController.addCommentToPost);

module.exports = router;
