import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import {io} from '../index.js';


export const addMessageToChat = async (req, res) => {
    try {
        const { senderId, receiverId, messageText } = req.body;

        // Check if the users exist
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the chat with both sender and receiver
        let chat = await Chat.findOne({
            $or: [
                { 'users.senderId': senderId, 'users.receiverId': receiverId },
                { 'users.senderId': receiverId, 'users.receiverId': senderId }
            ]
        });
        // console.log("chat",chat)
        // If chat does not exist, create a new one
        if (!chat) {
            chat = new Chat({
                users: { senderId, receiverId }
            });
            await chat.save();
        }

        // Create new message
        const message = new Message({
            chatId: chat._id,
            sender: senderId,
            message: messageText
        });

        await message.save();
        const chatId = chat._id;
        // Update the chat's last message
        chat.lastMessage = message._id;
        await chat.save();

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMessagesForChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        // console.log("messages",messages)
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};