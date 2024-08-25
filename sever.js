const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/', userRoutes); // Use the routes

app.listen(1414, () => {
    console.log('Server is running on port 1414');
});
