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
    postImage: {
        type: Buffer,
        required: true
    }, 
    postImageType: {
        type: String, 
        required: true
    },
})

PostSchema.virtual(`postImagePath`).get(function(){
    if(this.postImage != null  && this.postImageType != null){
        return `data: ${this.postImageType};charset=utf-8;base64,${this.postImage.toString(`base64`)}`
    }
})

const Post = mongoose.model('Post',PostSchema)

module.exports = Post;