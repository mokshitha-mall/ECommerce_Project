import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const signup = async(req, res) =>
{
    try{
        const {username, email, password, role} = req.body
        if(!username || !email || !password)
        {
            return res.status(400).json({message:'Fields are required'})
        }
        const existingUser = await User.findOne({email})
        if(existingUser)
        {
            return res.status(400).json({message:'Email Already Registered'})
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username:username,
            email:email,
            password:hashedPassword,
            role:role

        })
        res.status(200).json({message:'User Signup Successful', user})

    }
    catch(error)
    {
        return res.status(500).json({message:'Unable to create the user'})

    }
}

export const login = async(req, res) =>
{
    try{
        const {email, password} = req.body
        if(!email || !password) 
        {
            return res.status(400).json({message:'All Fields are required'})
        }

        const user = await User.findOne({email})

        if(!user)
        {
            return res.status(404).json({message:'Invalid email or password'})
        }

        const checkingPassword = await bcrypt.compare(password, user.password)
        if(!checkingPassword)
        {
            return res.status(404).json({message:'Invalid email or password'})
        }

        const token = jwt.sign({
            userId:user._id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        });
        
        res.status(200).json({message:"Login Successful", token, 
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                role:user.role
        }})
        }
    catch(error)
    {
        res.status(500).json({message:'Unable to login the user', error:error.message})

    }
}
