const mongoose = require('mongoose');

const MessageBoardSchema = new mongoose.Schema({
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MessageBoard",
    }],
    name:{
        type:String,
        required:true,
    },
    
    category:{
        type:String,
        required:true,
        enum: ["newOld", "company","city"],
    },

})

const MessageBoard = mongoose.model('MessageBoard',MessageBoardSchema);

module.exports = MessageBoard;
