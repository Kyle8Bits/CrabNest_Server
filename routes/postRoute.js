const express = require('express');
const router = express.Router();
const {
    // getPosts,
    // getPostById,
    // createPost,
    // updatePost,
    // deletePost,
    getPostsForUser,
    giveReact,
    deleteReact
} = require('../controllers/postController');

// Define the routes
router.get('/getPost', getPostsForUser);

router.post('/giveReact', giveReact);

router.post('/deleteReact', deleteReact);



module.exports = router;
