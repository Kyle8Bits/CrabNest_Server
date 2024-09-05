const express = require('express');
const router = express.Router();
const {
    // getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getPostsForUser,
    giveReact,
    deleteReact
} = require('../controllers/postController');

const upload = require('../middleware/multer')

// Define the routes
router.get('/getPost', getPostsForUser);

router.get('/getPostById', getPostById);

router.post('/giveReact', giveReact);

router.post('/deleteReact', deleteReact);

router.post('/createPost', upload.fields([{name: 'post', maxCount: 4}]) ,createPost);
 
router.put('/updatePost', upload.fields([{name: 'post', maxCount: 4}]),updatePost);

router.delete('/deletePost', deletePost);

module.exports = router;
