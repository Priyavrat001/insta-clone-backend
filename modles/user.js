import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    passwrod: {
        type: String,
        required: true,
        select: false
    },
    porfilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    bookmarks:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"Post"
        }
    ]
},{timestamps:true})

export const User = mongoose.models?.User || mongoose.model("User", userSchema)