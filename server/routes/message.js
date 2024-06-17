import express from 'express';
import { verification } from '../middleware/auth.js';
import {addMessageToChat,getMessagesForChat} from "../controllers/messages.js"

const router = express.Router();

router.post('/', verification, addMessageToChat);

// Retrieve all messages for a chat
router.get('/:chatId', verification, getMessagesForChat);

export default router;