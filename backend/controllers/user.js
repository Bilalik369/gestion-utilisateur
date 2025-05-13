import mongoose from "mongoose";

const userScheme = new mongoose.Schema({

    username: {
        type : String,
        required: true,
        trim : true,
        
    },

    email: {
        type : String,
        required: true,
        trim : true,
        unique : true,
        lowercase:true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
      },

      phone: {
        type: String,
        trim: true,
        default: ''
      },

      isAdmin: {
        type: Boolean,
        default: false
      },

    isVerified :{
        type : Boolean,
        default:false
    },

    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    emailChangeToken: String,
    emailChangeTokenExpiry: Date,
    pendingEmail: String,
    phoneChangeToken: String,
    phoneChangeTokenExpiry: Date,
    pendingPhone: String,
    

    createdAt : {
        type:Date,
        default:Date.now
    }, 

    lastLogin:Date,

}, {timestamps:true});

export const User = mongoose.model("User" ,userScheme );