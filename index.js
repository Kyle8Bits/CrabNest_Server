const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const UserModel = require('./models/Users')

const db_url ='mongodb+srv://crabnestdev:rmitnguyenvanlinh@crabnest.tygyr.mongodb.net/crabnestdb?retryWrites=true&w=majority&appName=crabNest'

mongoose.connect(db_url, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
    }
);

app.get('/getUsers',(req,res)=>{
    UserModel.find()
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.listen(1414, ()=>{
    console.log("Sever is running")
})