// controllers/userController.js
const { retry } = require('@reduxjs/toolkit/query');
const User = require('../models/User'); // Assuming you have a User model defined
const bcrypt = require('bcrypt');
const path = require('path');

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Use async/await to handle the promise returned by findOne
        const user = await User.findOne({ username });
        if (!user) {
            console.log(username, password)
            return res.status(401).json({ message: 'The username does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password' });
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

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        if (phone && !isValidPhoneNumber(phone)) {
            return res.status(400).json({ message: 'Invalid phone number. It should be exactly 10 digits.' });
        }

        const existingPhone =  await User.findOne({ phone });
        if(existingPhone){
            return res.status(400).json({ message: 'This phone number already used' });
        }

        // Define the default avatar and banner paths
        const defaultAvatar = '/uploads/avatar/default-avatar.jpg';
        const defaultBanner = '/uploads/banner/default-banner.jpg';

        // Create a new user with default images if none are provided
        const newUser = new User({
            username,
            fullName,
            email,
            phone,
            password,
            bio: "No bio yet",
            avatar: defaultAvatar, // Set the default avatar path
            banner: defaultBanner,// Set the default banner path
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const isValidPhoneNumber = (phone) => {
    // Check if the phone number is a string of exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
};

const updateUserProfile = async (req, res) => {
    try {
        const { username, fullName, email, phone, bio } = req.body;
        const userName = req.body.username; // Use username to find the user
        
        // Find the user by username
        const user = await User.findOne({ username: userName });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (phone && !isValidPhoneNumber(phone)) {
            return res.status(400).json({ message: 'Invalid phone number. It should be exactly 10 digits.' });
        }

        // Update the user profile fields
        user.username = username || user.username;
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.bio = bio || user.bio;

        // Handle the avatar upload
        if (req.files.avatar) {
            user.avatar = `/uploads/avatar/${req.files.avatar[0].filename}`;
        }

        // Handle the banner upload
        if (req.files.banner) {
            user.banner = `/uploads/banner/${req.files.banner[0].filename}`;
        }


        if (req.files.avatar) {
            const avatarFileType = path.extname(req.files.avatar[0].filename).toLowerCase();
            if (!['.jpg', '.jpeg', '.png'].includes(avatarFileType)) {
                return res.status(400).json({ message: 'Invalid avatar file type. Only .jpg, .jpeg, and .png are allowed.' });
            }
            user.avatar = `/uploads/avatar/${req.files.avatar[0].filename}`;
        }

        // File type validation for banner
        if (req.files.banner) {
            const bannerFileType = path.extname(req.files.banner[0].filename).toLowerCase();
            if (!['.jpg', '.jpeg', '.png'].includes(bannerFileType)) {
                return res.status(400).json({ message: 'Invalid banner file type. Only .jpg, .jpeg, and .png are allowed.' });
            }
            user.banner = `/uploads/banner/${req.files.banner[0].filename}`;
        }

        // Save the updated user profile
        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { loginUser, registerUser, updateUserProfile };
