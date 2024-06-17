import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chatId:{
        type:String,
        required:true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});

const Message = mongoose.model('Message', MessageSchema);

export default Message;