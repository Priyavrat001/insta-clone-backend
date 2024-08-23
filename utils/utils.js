import mongoose from "mongoose"
import dotenv from "dotenv";
import DataUriParser from "datauri/parser.js";
import path from "path";
import {v1 as cloudinary} from "cloudinary";

dotenv.config();

const parser = new DataUriParser();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,

})

const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
};

const url = process.env.MONGO_URI || undefined;

const connectToDatebase = () => {
    mongoose.connect(url, {
        dbName: "insta"
    })
        .then(() => console.log("mongodb is connected"))
        .catch(err => console.log(err))
};

const getDataUri = (file)=>{
    const extName = path.extname(file.orignalname).toString();

    return parser.format(extName, file.buffer).content;
};



export {
    connectToDatebase,
    corsOptions,
    getDataUri,
    cloudinary
}