import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:String,
        required:true
    }
});

const conversationSchema = new mongoose.Schema({
    participants:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }
})

export const Message = mongoose.model("Message", messageSchema);
export const Conversation = mongoose.model("Conversation", conversationSchema);