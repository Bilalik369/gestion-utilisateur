import mongoose from "mongoose";
import { exit } from "process";



export const connectDb = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("database coonected succssfuly")
    }catch(error){
        console.log('error connection to mongodb');
        exit(1);
    }
};
