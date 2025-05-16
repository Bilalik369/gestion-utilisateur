import crypto from 'crypto';

/**
 * Generate a random token
 * @returns {string} Random token
 */
export const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a random verification code (for SMS)
 * @returns {string} 6-digit verification code
 */
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};