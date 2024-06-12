import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

/*REGISTER USER */
export const register = async(req,res)=>{
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        }=req.body;
        console.log(friends)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered with this email' });
        }


        const salt  =await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions:Math.floor(Math.random()*10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

/*LOGIN USER */
export const login = async(req,res)=>{
    try {
        const {
            email,
            password,
        }=req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User Not Found' });
        }

        const isMatch = bcrypt.compare(password,user.password);

        if(!isMatch)
            return res.status(400).json({ error: 'Invalid Credentials.' });
        
        const token = jwt.sign({id:user._id},process.env.JWT_SECRECT)
        delete user.password;
        res.status(200).json({token,user});

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}