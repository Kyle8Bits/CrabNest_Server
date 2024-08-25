// controllers/userController.js

const User = require('../models/User'); // Assuming you have a User model defined

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Use async/await to handle the promise returned by findOne
        const user = await User.findOne({ username, password }).select('-password');

        console.log(user.email);

        if (!user) {
            console.log(username, password)
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        
        res.json(user);
        
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { loginUser };
