// controllers/userController.js
const User = require('../models/User'); // Assuming you have a User model defined
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Use async/await to handle the promise returned by findOne
        const user = await User.findOne({ username });
        if (!user) {
            console.log(username, password)
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        res.json(user);
        
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const registerUser = async (req, res) => {
    try {
        const { username, fullName, email, phone, password } = req.body;
        console.log(username, fullName)

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Create a new user
        const newUser = new User({
            username,
            fullName,
            email,
            phone,
            password // This will be hashed before saving due to the pre-save middleware
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { loginUser, registerUser };
