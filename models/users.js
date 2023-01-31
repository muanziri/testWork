const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true
    },
    PassCode: {
        type: String,
        required: true
    },
    logginTimes:[],
    isLoggedIn: {
        type: String,
        required: true,
        default:false
    },
   

})

const UserModel=mongoose.model('users',UserSchema);

module.exports=UserModel;