import jwt from "jsonwebtoken"
import crypto from "crypto";
import dotenv from "dotenv";


dotenv.config();



export const genrateToken = (id)=>{
    return jwt.sign({id}), process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY
    }
}


export const generateVerificationToken= ()=>{
    return crypto.randomBytes(32).toString('hex')
}

export const generateResetToken= ()=>{
    return crypto.randomBytes(32).toString('hex')
}

export const generateEmailChangeToken= ()=>{
    return crypto.randomBytes(32).toString('hex')
}

export const generatePhoneChangeToken = () => {
    
    return Math.floor(100000 + Math.random() * 900000).toString();
  };