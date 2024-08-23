import express, { urlencoded } from "express";
import { connectToDatebase, corsOptions } from "./utils/utils.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
connectToDatebase();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(urlencoded({extended:true}));

app.use("/api/v1", userRoute);


app.use(errorMiddleware());

app.listen(port,()=>{
    console.log(`App is running port ${port}`)
})