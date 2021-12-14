const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
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

const Post = mongoose.model('Post',PostSchema)

module.exports = Post;