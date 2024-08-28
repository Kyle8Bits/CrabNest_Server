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
router.get('/getPost', getPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.get('/posts/:userId', getPostsForUser);
  
module.exports = router;
