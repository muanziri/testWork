const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({

    PcNumber: {
        type: String,
        required: true
    },
    currentUser: {
        type: String,
        required: true,
        default: 'no user'
    }
})

const UserModel=mongoose.model('PCs',UserSchema);

module.exports=UserModel;