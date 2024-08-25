// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    const db_url = 'mongodb+srv://crabnestdev:rmitnguyenvanlinh@crabnest.tygyr.mongodb.net/crabnestdb?retryWrites=true&w=majority&appName=crabNest';

    try {
        await mongoose.connect(db_url);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    }
};

module.exports = connectDB;