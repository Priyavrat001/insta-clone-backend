import { TryCatch } from "../middlewares/errorMiddleware";
import { ErrorHandler } from "../utils/utility-classes";
import {User} from "../models/user.js"
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

const createUser = TryCatch(async(req, res, next)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password) return new ErrorHandler("Invalid Credentials", 400);

    const jwtStr = process.env.JWT_STR

    const hashPassword = bcrypt.hash(jwtStr, 10)

    const user = await User.create({
        username,
        email,
        hashPassword
    })

    return res.status(200).json({success:true, user})
})

export{
    createUser
}