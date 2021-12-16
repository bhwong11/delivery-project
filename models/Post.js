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
    messageBoard:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MessageBoard',
        required: true
    },
    postImage: {
        type: Buffer,
    }, 
    postImageType: {
        type: String, 
    },
})

PostSchema.virtual(`postImagePath`).get(function(){
    if(this.postImage != null  && this.postImageType != null){
        return `data: ${this.postImageType};charset=utf-8;base64,${this.postImage.toString(`base64`)}`
    }else{
        return `https://img.myloview.com/canvas-prints/carton-parcel-box-icon-isometric-of-carton-parcel-box-vector-icon-for-web-design-isolated-on-white-background-700-210532772.jpg`
    }
})

const Post = mongoose.model('Post',PostSchema)

module.exports = Post;