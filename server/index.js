import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import chatsRoutes from "./routes/chats.js"
import messageRoute from "./routes/message.js"
import {register} from "./controllers/auth.js"
import {createPost} from "./controllers/posts.js"
import { verification } from './middleware/auth.js';
import User from "./models/User.js"
import Post from './models/Post.js';
import Chat from './models/Chat.js';
import Message from './models/Message.js';
import {users,posts,chats,messages} from './data/index.js'
import http from 'http'; // Import http module
import { Server } from 'socket.io'; 
import { read } from 'fs';

let connected_users=[]


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
dotenv.config();
const app =express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"))
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

/*FILE STORAGE*/
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,"public/assets")
    },
    filename:function (req,file,cb) {
        cb(null,file.originalname)
    }
})
const upload = multer({storage})


/*ROUTES WITH FILES */
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts",verification,upload.single("picture"),createPost);
/*ROUTES*/
app.use("/auth",authRoutes);
app.use("/users",usersRoutes)
app.use("/posts",postsRoutes)
app.use("/chats", chatsRoutes);
app.use("/message",messageRoute)

const server  = http.createServer(app);
export const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

const addUser=(userId,socketId)=>{
    !connected_users.some(user => user.userId === userId) && connected_users.push({userId,socketId});
}

const removeUser=(socketId)=>{
    connected_users =connected_users.filter(user=>user.socketId!==socketId)
}


const getUser = (userId)=>{
    // console.log(connected_users)
    // console.log(connected_users.find(user=>user.userId===userId))
    return connected_users.find(user=>user.userId===userId)
}

const createMessage = async (chatId,senderId,receiverId,messageText,socket)=>{
    const message = new Message({
        chatId:chatId,
        sender:senderId,
        message:messageText,
        read:false,
    }
    );
        await message.save();

        let chat = await Chat.findById(chatId);
        if (!chat) {
            chat = new Chat({ _id: chatId, users: { senderId, receiverId } });
        }
        chat.lastMessage = message._id;
        await chat.save();

        return message;
}

io.on('connection',(socket)=>{
    //When connected
    console.log('A user connected')

    //add user for online-offline
    socket.on("addUser",(userId)=>{
        console.log("adding user...")
        addUser(userId,socket.id)
        console.log("connected_users",connected_users)
        io.emit("getUsers",connected_users)
    })


    socket.on("sendMessage",async ({chatId,senderId,receiverId,messageText,messageId})=>{
        console.log("senderId",senderId)
        console.log("receiverId",receiverId)
        const receiver = getUser(receiverId)
        if (!receiver) {
            console.log("Recipient is not online or not found.");
            // Handle the situation where the recipient is not online or not found
            // For example, store the message in a database or notify the sender
            // You can also emit an event back to the sender to inform them about the issue
            // socket.emit("recipientOffline", { message: "Recipient is not online." });
            // Still emit the getMessage event to update the sender's UI
            
            // saveMessageIfUserOffline(chatId,senderId,receiverId,messageText,socket)
            
            return;
          }
        // const message= await createMessage(chatId,senderId,receiverId,messageText,socket)
        
        console.log("sending the message",messageText)
        
        io.to(receiver.socketId).emit("getMessage", {
            messageId,
            chatId,
            senderId,
            messageText,
            read:false,
        });
        
        const checkReadStatus = async () => {
            const receiver = getUser(receiverId);
            if (receiver) {
              // Update message read status
              await Message.findByIdAndUpdate(messageId, { read: true });
              io.to(receiver.socketId).emit('messageReadUpdate', {
                messageId,
                chatId,
              });
              clearInterval(checkInterval); // Clear the interval if the receiver is connected
            }
          };
      
          const checkInterval = setInterval(checkReadStatus, 5000);
    })

    //Message read or not ?
    socket.on('messageRead', async ({ messageId, chatId, senderId, receiverId }) => {
        try {
            const message = await Message.findById(messageId);
            const receiver = getUser(receiverId)
            
            if (message && receiver) {
                message.read = true;
                await message.save();

                const sender = getUser(senderId);
                if (sender) {
                    io.to(sender.socketId).emit('messageReadUpdate', { messageId, chatId });
                }
            }
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    });

    //on disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        removeUser(socket.id)
        io.emit("getUsers",connected_users)
    });
    
})

/* MONGOOSE SETUP */
const PORT = process.env.PORT||6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    // app.listen(PORT,()=>console.log(`SERVER Running on PORT: ${PORT}`))    
    server.listen(PORT,()=>console.log(`SERVER Running on PORT: ${PORT}`))
    /*ADDED ALREADY SO DONT USE IT AGAIN */
    // User.insertMany(users);
    // Post.insertMany(posts);
    // Chat.insertMany(chats);
    // Message.insertMany(messages)
}).catch((error)=>console.log(`${error} Did Not Connect`))  
