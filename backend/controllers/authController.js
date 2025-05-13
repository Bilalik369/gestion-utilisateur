import { User } from "../models/user";
import {generateVerificationToken} from "../utils/tokenService.js"


export const registerUser = async(req, res)=>{
   try{

    const {username , email , password , phone} = req.body;

    if(!username || !email || !password || !phone){
        return res.stauts(401).json({msg:"All fields are required"})
    }

    const userAlreadyExists = await User.findOne({email})
    console.log("userAlreadyExists", userAlreadyExists);

    if(userAlreadyExists){
        return res.stauts(401).json({msg : "User already exists"})
    };


    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 60 *60 * 1000);



    const user = await User.create({
        username, 
        email, 
        password,
        phone : phone || "",
        verificationToken,
        verificationTokenExpiry,
    })

   




    
    

   }catch(error){
      
   }
}