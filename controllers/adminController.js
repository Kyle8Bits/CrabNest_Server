const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Group = require('../models/Group');
const GroupRequest = require('../models/GroupRequest');

const fetchUsers = async (req, res) => {
    try {
        const users = await User.find({ isAdmin: false });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
};

const fetchGroupRequests = async (req, res) => {
    try {
        const groupRequests = await GroupRequest.find({ status: 'pending' });
        res.json(groupRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const suspendUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { isSuspended: true }, { new: true });
        res.json({ userId: user._id, isSuspended: user.isSuspended });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resumeUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, { isSuspended: false }, { new: true });
        res.json({ userId: user._id, isSuspended: user.isSuspended });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveGroupCreation = async (req, res) => {
    try {
        const group = await GroupRequest.findByIdAndUpdate(req.params.groupId, { status: 'approved' }, { new: true });
        res.json({ groupId: group._id, status: group.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectGroupCreation = async (req, res) => {
    try {
        const group = await GroupRequest.findByIdAndUpdate(req.params.groupId, { status: 'rejected' }, { new: true });
        res.json({ groupId: group._id, status: group.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.json({ postId: req.params.postId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ postId: req.params.postId, commentId: req.params.commentId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { fetchUsers, fetchGroupRequests, suspendUser, resumeUser, deletePost, deleteComment, approveGroupCreation, rejectGroupCreation};