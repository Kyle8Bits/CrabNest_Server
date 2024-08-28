const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsForUser,
} = require('../controllers/postController');

// Define the routes
router.get('/getPost', getPostsForUser);
  
module.exports = router;
