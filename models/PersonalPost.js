const mongoose = require('mongoose');

const PersonalPostSchema = new mongoose.Schema({
    title:{
        type:String,
        default:'no title added',
    },
    content:{
        type:String,
        default:'no content added',
    },
    date_created:{
        type:Date,
        default:Date.now(),
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
})

const PersonalPost = mongoose.model('PersonalPost',PersonalPostSchema)

module.exports = PersonalPost;