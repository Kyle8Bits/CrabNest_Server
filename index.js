const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://<crabnestdev>:<ihatefullstack>@cluster0.mongodb.net/CrabNestDB?retryWrites=true&w=majority'

const app = express();
app.use(cors)
app.use(express.json())

mongoose.connect()

app.listen(1414, ()=>{
    console.log("Sever is running")
})