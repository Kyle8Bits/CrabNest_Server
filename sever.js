const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const friendRoutes = require ('./routes/friendRoute')
const postRoutes = require('./routes/postRoute')
const adminRouter = require('./routes/adminRoute')
const commentRoutes = require('./routes/commentRoute');
const groupRoutes = require('./routes/groupRoute');
const NotificationRoute = require('./routes/notificationRoute');
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoutes); // Use the routes

app.use('/friend', friendRoutes);

app.use('/posts',postRoutes);

app.use('/admin',adminRouter);

app.use('/comment',commentRoutes);

app.use('/group', groupRoutes);

app.use('/notification',NotificationRoute);

app.listen(1414, () => {
    console.log('Server is running on port 1414');
});
