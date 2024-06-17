import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    users:{
        senderId: {
            type:String,
            required: true
        },
        receiverId: {
            type:String,
            required: true
        }
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
},{ timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;