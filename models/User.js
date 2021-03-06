const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        default:'N/A Name'
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    company:{
        type:String,
        default:'Other',
    },
    city:{
        type:String,
        default:'N/A',
    },
    personalPost:{
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PersonalPost",
        }]
    },
    messageBoards:{
        type:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MessageBoard",
        }]
    },
    signup_date:{
        type:Date,
        default:Date.now(),
    }
})

const User = mongoose.model('User',UserSchema);

module.exports = User;