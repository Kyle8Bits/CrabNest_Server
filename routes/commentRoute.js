const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Route to get all comments for a specific post
router.get('/getComments', commentController.getCommentsForPost);

// Route to add a comment to a specific post
router.post('/addComment', commentController.addCommentToPost);

router.delete('/deleteComment', commentController.deleteComment);

router.post('/editComment', commentController.editComment);
module.exports = router;
