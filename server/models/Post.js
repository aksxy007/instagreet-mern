import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userPicturePath: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    likes:{
        type:Map,
        of:Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    location:String,
    picturePath:{
        type:String,
        default:"",
    },
    userPicturePath:{
        type:String,
        default:"",
    },
    discription:String,
    likes:{
        type:Map,
        of:Boolean,
    },
    comments:[CommentSchema]
},{timestamps:true})

const Post = mongoose.model("Post",PostSchema);
export default Post;