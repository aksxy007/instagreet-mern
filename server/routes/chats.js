import express from 'express';
import { verification } from '../middleware/auth.js';
import {getChatsForUser,CreateChat,FindChat} from "../controllers/chats.js"

const router = express.Router();

/*READ */
router.get("/:userId",verification,getChatsForUser);
router.get("/find/:userId/:receiverId",verification,FindChat)

// Update
router.post("/",verification,CreateChat)


export default router;