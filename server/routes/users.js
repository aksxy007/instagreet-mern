import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getAllUsers
} from "../controllers/users.js"
import { verification } from '../middleware/auth.js';

const router =express.Router();

/*READ */
router.get("/:id",verification,getUser);
router.get("/:id/friends",verification,getUserFriends);
router.get("/",verification,getAllUsers)

/*UPDATE */
router.patch("/:id/:friendId",verification,addRemoveFriend);

export default router;