const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');

const createGroup = async (req, res) => {
    try{
        // Create a new group using the request body
        const newGroup = new Group({
            name: req.body.data.groupName,
            description: req.body.data.groupDescription,
            isPrivate: req.body.data.groupPrivacy === 'public' ? false : true,
            admins: [req.body.data.username],
             banner: '/uploads/banner/default-banner.jpg'
        });

        // Save the new group to the database
        const savedGroup = await newGroup.save();

        // Respond with the saved group
        res.status(201).json(savedGroup);
       
    }
    catch(err){
        console.error('Error creating group:', err.message);
        res.status(500).json({error: 'Unable to create group'});
    }
}

const getGroupForUser = async (req, res) => { 
    try{
        const admin = req.query.username;
        const groups = await Group.find({ admins: admin });

        // Respond with the list of groups
        res.status(200).json(groups);
    }catch(err){
        console.error('Error geting group:', err.message);
        res.status(500).json({error: 'Unable to get group'});
    }
}

const getGroupById = async (req, res) => {
    try{
        const groupId = req.query.groupId;
        const group = await Group  .findOne({ id: groupId});

        // Respond with the group
        res.status(200).json(group);
    }
    catch(err){
        console.error('Error geting group:', err.message);
        res.status(500).json({error: 'Unable to get group'});
    }
}

const getWaitlist = async (req, res) => { 
    try {
        const groupId = req.query.groupId;
        const group = await Group.findOne({ id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const userIds = group.waitlist;
        const users = await User.find({ username: { $in: userIds } });

        res.status(200).json(users);
    } catch (err) {
        console.error('Error getting waitlist:', err.message);
        res.status(500).json({ error: 'Unable to get waitlist' });
    }   
}

const getAdmins = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const group = await Group.findOne({ id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const adminUsers = await User.find({ username: { $in: group.admins } });

        // Respond with the list of admin users
        res.status(200).json(adminUsers);
    } catch (err) {
        console.error('Error getting admins:', err.message);
        res.status(500).json({ error: 'Unable to get admins' });
    }
}

const addAdmin = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate(
            { id: groupId },
            { $addToSet: { admins: username } },
            {$addToSet: {members: username}},
            { new: true }
        );

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (err) {
        console.error('Error adding admin:', err.message);
        res.status(500).json({ error: 'Unable to add admin' });
    }
};

const removeAdmin = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate(
            { id: groupId },
            { $pull: { admins: username } },
            {$pull: {members: username}},
            { new: true }
        );

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.status(200).json({ message: 'Admin removed successfully', group });
    }
    catch(err){
        console.error('Error removing admin:', err.message);
        res.status(500).json({error: 'Unable to remove admin'});
    }
}

const editBanner = async (req, res) => {
    try {
        const groupId = req.body.groupId;

        const banner = req.files.banner[0].filename;


        const group = await Group.findOneAndUpdate({id:groupId}, { banner: `/uploads/banner/${banner}` }, { new: true });

        res.status(200).json(group);
    }
    catch(err){
        console.error('Error editing banner:', err.message);
        res.status(500).json({error: 'Unable to edit banner'});
    }
}

const getCommunities = async (req, res) => {
    try {
        const groups = await Group.find({});

        // Respond with the list of groups
        res.status(200).json(groups);
    } catch (err) {
        console.error('Error getting communities:', err.message);
        res.status(500).json({ error: 'Unable to get communities' });
    }
};


const joinGroup = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate( { id: groupId }, { $addToSet: { waitlist: username } }, { new: true });

        res.status(200).json(group);
    }
    catch(err){
        console.error('Error joining group:', err.message);
        res.status(500).json({error: 'Unable to join group'});
    }
}

const leaveGroup = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate( { id: groupId }, { $pull: { members: username } }, { new: true });
        res.status(200).json(group);
    }
    catch(err){
        console.error('Error leaving group:', err.message);
        res.status(500).json({error: 'Unable to leave group'});
    }   
}

const cancelJoin = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate( { id: groupId }, { $pull: { waitlist: username } }, { new: true });
        res.status(200).json(group);
    }
    catch(err){
        console.error('Error cancel join group:', err.message);
        res.status(500).json({error: 'Unable to leave group'});
    }
}

const acceptJoiningRequest = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate( { id: groupId }, { $pull: { waitlist: username }, $addToSet: { members: username } }, { new: true });

        return res.status(200).json(group);
    }
    catch(err){
        console.error('Error accepting join request:', err.message);
        res.status(500).json({error: 'Unable to accept join request'});
    }
}

const rejectJoiningRequest = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        const group = await Group.findOneAndUpdate( { id: groupId }, { $pull: { waitlist: username } }, { new: true });
    }
    catch(err){
        console.error('Error accepting join request:', err.message);
        res.status(500).json({error: 'Unable to accept join request'});
    }
}


module.exports = {
    createGroup,
    getGroupForUser,
    getGroupById,
    getAdmins,
    editBanner,
    addAdmin,
    removeAdmin,
    getCommunities,
    joinGroup,
    leaveGroup,
    cancelJoin,
    getWaitlist,
    acceptJoiningRequest,
    rejectJoiningRequest
}