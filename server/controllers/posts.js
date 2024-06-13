import Post from "../models/Post.js"
import User from "../models/User.js";

/*CREATE */
export const createPost = async (req,res)=>{
    try {
        
        const {userId,description,picturePath} = req.body;
        const user = await User.findOne({_id:userId});
        
        const newPost= new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            localtion:user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[]
            
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post)
    } catch (error) {
        res.status(409).json({error:error.message})
    }
}

/*READ */
export const getFeedPosts = async (req,res)=>{
    try {
        const post = await Post.find();
        res.status(201).json(post)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}


export const getUserPosts = async (req,res)=>{
    try {
        const {userId} = req.params;
        const userPosts = await Post.find({userId});
        res.status(201).json(userPosts)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}


/*UPDATE */
export const likePost = async (req,res)=>{
    try {
        const {id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked  = post.likes.get(userId);
        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true);
        }

        const updatedPost = await Post.findByIdAndUpdate(id,{likes:post.likes},{new:true});


        res.status(201).json(updatedPost)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}

export const updateComments = async (req,res)=>{
    const {postId} = req.params;
    const {userId,firstName,lastName,userPicturePath,text}=req.body;

    try{
        const post = await Post.findById(postId);
        const newComment = {userId,firstName,lastName,userPicturePath,text,likes:{}}
        post.comments.push(newComment)
        await post.save();
        res.status(200).json(post);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

export const deleteComment = async (req,res)=>{
    const {postId,commentId} = req.params;

    try{
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json(post);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

export const likePostComment = async (req,res)=>{
    try {
        const {postId,commentId} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.likes.get(userId)) {
            comment.likes.delete(userId);
        } else {
            comment.likes.set(userId, true);
        }

        await post.save();

        res.status(201).json(post)
    } catch (error) {
        res.status(404).json({error:error.message})
    }
}
