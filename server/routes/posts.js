import express from 'express';
import {getFeedPosts,getUserPosts,likePost} from "../controllers/posts.js";
import { verification } from '../middleware/auth.js';

const router = express.Router();

/*READ */
router.get("/",verification,getFeedPosts);
router.get("/:userId/posts",verification,getUserPosts);

/*UPDATE */
router.patch("/:id/like",verification,likePost);

export default router;