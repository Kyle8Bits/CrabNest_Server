const Friendship = require('../models/Friendship');
const User = require('../models/User');

const getFriends = async (req, res) => {
    try {
        const { username } = req.query;

        // Find all friendships where the requester or recipient is the current user and status is 'Accepted'
        const friendships = await Friendship.find({
            $or: [{ requester: username }, { recipient: username }],
            status: 'Accepted'
        });

        // Extract the list of friend usernames (opposite of current user's username)
        const friendUsernames = friendships.map(friendship => {
            return friendship.requester === username ? friendship.recipient : friendship.requester;
        });

        // Find all user details for these friend usernames
        const friends = await User.find({ username: { $in: friendUsernames } });

        // Respond with the found user details in JSON format
        res.json(friends);
    } catch (error) {
        console.error('Error in getFriends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteFriendship = async (req, res) => {
    try {
        const { requester, recipient } = req.body; //nguyechau kyle

        // Find and delete the friendship where requester and recipient match
        const result = await Friendship.findOneAndDelete({
            $or: [
                { requester, recipient }, 
                { requester: recipient, recipient: requester }
            ]
        });

        if (!result) {
            return res.status(404).json({ message: 'Friendship not found' });
        }

        res.status(200).json({ message: 'Friendship deleted successfully' });
    } catch (error) {
        console.error('Error in deleteFriendship:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getFriends, deleteFriendship };