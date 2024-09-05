const Group = require('../models/Group');
const mongoose = require('mongoose');

const createGroup = async (req, res) => {
    try{
        console.log(req.body);
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

module.exports = {
    createGroup,
    getGroupForUser
}