import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// Retrieve all chats for a specific user
export const getChatsForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all chats where the user is either the sender or the receiver
        const chats = await Chat.find({
            $or: [
                { 'users.senderId': userId },
                { 'users.receiverId': userId }
            ]
        })
        .populate('users.senderId', 'firstName lastName')
        .populate('users.receiverId', 'firstName lastName')
        .populate('lastMessage');

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const CreateChat = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        // Find the chat with both sender and receiver
        let chat = await Chat.findOne({
            $or: [
                { 'users.senderId': senderId, 'users.receiverId': receiverId },
                { 'users.senderId': receiverId, 'users.receiverId': senderId }
            ]
        });

        // If chat does not exist, create a new one
        if (!chat) {
            chat = new Chat({
                users: { senderId, receiverId },
                lastMessage: null
            });
            await chat.save();
        }

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const FindChat = async (req, res) => {
    try {
        
        const senderId = req.params.userId;
        const receiverId = req.params.receiverId;

        // console.log(senderId)
        // console.log(receiverId)
        // Find the chat with both sender and receiver
        let chat = await Chat.findOne({
            $or: [
                { 'users.senderId': senderId, 'users.receiverId': receiverId },
                { 'users.senderId': receiverId, 'users.receiverId': senderId }
            ]
        });

        // let chat  = await Chat.findById(chatId)
        // console.log("chat",chat)
        // If chat does not exist,
        if(chat===null){
            chat = new Chat({
                users: { senderId, receiverId },
                lastMessage: null
            });
            await chat.save();
        }
        
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

