const Group = require('../models/Group');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
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
        const groups = await Group.find({ 
            admins: admin, 
            status: 'Approve'  // Only return groups with status 'Accepted'
        });


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
        const groups = await Group.find({ 
            status: 'Approve'  // Only return groups with status 'Accepted'
        });


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

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const adminUsernames = group.admins; // Assuming 'admins' is an array of usernames

        // Create notifications for each admin
        const notifications = adminUsernames.map(adminUsername => {
            return new Notification({
                user: adminUsername, // The admin receiving the notification
                from: username, // The user who requested to join the group
                type: 'JoinGroupRequest', // Notification type
                message: `${username} has requested to join the group ${group.name}.`,
            });
        });

        // Save all notifications
        await Promise.all(notifications.map(notification => notification.save()));

        // Return the updated group with the user added to the waitlist
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

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const notification = new Notification({
            user: username, // The user who is being accepted
            from: group.name,
            type: 'GroupApproval',
            message: `You have been accepted into the group ${group.name}`
        });

        await notification.save();

        return res.status(200).json({ message: `${username} has been added to the group`, group });
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

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const notification = new Notification({
            user: username, // The user who is being rejected
            from: group.name, // Assuming `group.admin` holds the admin's username or full name
            type: 'GroupApproval',
            message: `Your request to join the group ${group.name} has been rejected`
        });

        await notification.save();

        return res.status(200).json({ message: `${username}'s join request has been rejected`, group });
    }
    catch(err){
        console.error('Error accepting join request:', err.message);
        res.status(500).json({error: 'Unable to accept join request'});
    }
}

const getPostForGroup = async (req, res) => {
    try {
        const groupId = req.query.groupId;
        const posts = await Post.find({ group: groupId });

        const result = await Promise.all(posts.map(async (post) => {
            const user = await User.findOne({ username: post.author }); 
            return {
                fullname: user.fullName,
                avatar: user.avatar,
                post: post
            };
        }));

        console.log(result);
        return res.status(200).json(result);
    }
    catch(err){
        console.error('Error getting post for group:', err.message);
        res.status(500).json({error: 'Unable to get post for group'});
    }
}

const getMembers = async (req, res) => {
    try {
        const groupId = req.query.groupId;

        const group = await Group.findOne({ id: groupId });

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Fetch users whose usernames are in the members list of the group
        const users = await User.find({ username: { $in: group.members } });

        // Respond with the group and the array of members
        res.status(200).json(
            users // List of users whose usernames are in the group.members
        );
        
    }
    catch(err){
        console.error('Error getting members:', err.message);
        res.status(500).json({error: 'Unable to get members'});
    }
}

const kickMember = async (req, res) => {
    try {
        const groupId = req.body.groupId;
        const username = req.body.username;

        // Find the group and remove the member in one step using $pull
        const group = await Group.findOneAndUpdate(
            { id: groupId },
            { $pull: { members: username } }, // Removes the user from the members array
            { new: true } // Return the updated group after modification
        );

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the user was actually in the members 

        // Respond with success message
        res.status(200).json({ message: `User ${username} has been kicked from the group` });

    }
    catch(err){
        console.error('Error kicking member:', err.message);
        res.status(500).json({error: 'Unable to kick member'});
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
    rejectJoiningRequest,
    getPostForGroup,
    getMembers,
    kickMember
}