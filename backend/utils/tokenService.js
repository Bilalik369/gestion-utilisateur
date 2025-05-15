import jwt from "jsonwebtoken"
import crypto from "crypto"
import "dotenv/config"


export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" })
}


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}


export const generateVerificationToken = () => {
  
  return Math.floor(100000 + Math.random() * 900000).toString()
}


export const generateResetToken = () => {
  
  const resetToken = crypto.randomBytes(32).toString("hex")

  
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  return {
    resetToken,
    hashedToken,
  }
}
