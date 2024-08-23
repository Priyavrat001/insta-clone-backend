import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility-classes";
import dotenv from "dotenv";

dotenv.config();

export const isAuthenticated = async(req, res, next)=>{
    const token = req.cookies.token;

    if(!token) return next(new ErrorHandler("User not authenticated", 401));

    const decode = jwt.verify(token, process.env.JWT_STR);

    if(!decode) return next(new ErrorHandler("Invalide", 401));

    req.user = decode.userId;
    next();
}