import express from 'express';
import {deleteComment, getFeedPosts,getUserPosts,likePost, likePostComment, updateComments} from "../controllers/posts.js";
import { verification } from '../middleware/auth.js';

const router = express.Router();

/*READ */
router.get("/",verification,getFeedPosts);
router.get("/:userId/posts",verification,getUserPosts);

/*UPDATE */
router.patch("/:id/like",verification,likePost);
router.patch("/:postId/comments",verification,updateComments)
router.patch("/:postId/comments/:commentId",verification,deleteComment)
router.patch("/:postId/comments/:commentId/like",verification,likePostComment)

export default router;