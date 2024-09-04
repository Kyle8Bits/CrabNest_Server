
const User = require('../models/User');
const Group = require('../models/Group');

const getBanned = async(req,res)=>{
    try{
        const suspendedUsers = await User.find({isSuspended: true});

        res.json(suspendedUsers)
    }
    catch(err){
        res.status(500).json({ message: 'Error retrieving suspended users', error });
    }
}

const getActive = async(req,res)=>{
    try{
        const suspendedUsers = await User.find({isSuspended: false});

        res.json(suspendedUsers)
    }
    catch(err){
        res.status(500).json({ message: 'Error retrieving suspended users', error });
    }
}

const banUser = async(req,res) =>{
    try {
        const { username } = req.body.data.username;
        console.log(req.body.data.username)

        // Find the user by username and update the isSuspended field to false
        const result = await User.findOneAndUpdate(
            { username: username }, // Find user with the specified username
            { isSuspended: true },  // Set isSuspended to true
            { new: true }            // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: `User ${username} has been banned.`, user: result });
        } else {
            console.log("Username not found")
            res.status(404).json({ message: `User ${username} not found.` });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Error banning user', error });
    }
}

const unBanUser = async (req, res) => {
    try {
        const { username } = req.body.data.username;
        console.log(req.body.data.username)

        // Find the user by username and update the isSuspended field to false
        const result = await User.findOneAndUpdate(
            { username: username }, // Find user with the specified username
            { isSuspended: false },  // Set isSuspended to false
            { new: true }            // Return the updated document
        );

        if (result) {
            res.status(200).json({ message: `User ${username} has been unbanned.`, user: result });
        } else {
            console.log("Username not found")
            res.status(404).json({ message: `User ${username} not found.` });
        }
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Error unbanning user', error });
    }
};

const getGroupReq = async (req, res) => {
    try {
        // Find all groups with status 'Pending'
        const pendingGroups = await Group.find({ status: 'Pending' });

        // Respond with the list of pending groups
        res.status(200).json(pendingGroups);
    } catch (err) {
        console.error('Error retrieving pending groups:', err.message);
        res.status(500).json({ error: 'Unable to retrieve pending groups' });
    }
}

const decideGrougReq = async (req,res) =>{
    try{
        
    }
    catch(err){
        console.error('Error approving group:', err.message);
        res.status(500).json({error: 'Unable to approve group'});
    }
    
}

module.exports = {getBanned, getActive ,banUser, unBanUser, getGroupReq, decideGrougReq};