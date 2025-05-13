import express from "express";
import dotenv from "dotenv";
import {connectDb} from "./lib/db.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`sever is rannuing in ${PORT}` )
    connectDb();

})