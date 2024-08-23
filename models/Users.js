const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    phoneNum: String,
    info: [
        {
            action: String,
            place: String
        }
    ]
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;