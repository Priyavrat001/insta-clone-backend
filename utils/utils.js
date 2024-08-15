import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config();

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

export {
    connectToDatebase,
    corsOptions
}