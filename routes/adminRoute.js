const express = require('express');
const { fetchUsers, fetchGroupRequests, suspendUser, resumeUser, deletePost, deleteComment, approveGroupCreation, rejectGroupCreation } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', fetchUsers); // Fetch users
router.get('/group_requests', fetchGroupRequests);
router.put('/suspend/:userId', suspendUser); // Suspend a user
router.put('/resume/:userId', resumeUser); // Resume a user
router.put('/approve/:groupId', approveGroupCreation); // Approve a group
router.put('/reject/:groupId', rejectGroupCreation);
router.delete('/delete/:postId', deletePost); // Delete a post
router.delete('/delete/:postId/:commentId', deleteComment); // Delete a comment


module.exports = router;
