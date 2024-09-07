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
    deleteReact,
    createPostInGroup,
    getPostOfUser
} = require('../controllers/postController');

const upload = require('../middleware/multer')

// Define the routes
router.get('/getPost', getPostsForUser);

router.get('/getPostById', getPostById);

router.post('/giveReact', giveReact);

router.post('/deleteReact', deleteReact);

router.post('/createPost', upload.fields([{name: 'post', maxCount: 4}]) ,createPost);
 
router.put('/updatePost', upload.fields([{name: 'post', maxCount: 4}]),updatePost);

router.post('/createPostInGroup', upload.fields([{name: 'group', maxCount: 4}]), createPostInGroup);

router.delete('/deletePost', deletePost);

router.get('/getPostOfUser', getPostOfUser);

module.exports = router;
