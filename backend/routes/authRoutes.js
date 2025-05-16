import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate, registerRules, loginRules, resetPasswordRules } from '../middleware/validator.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  registerRules,
  validate,
  authController.register
);

// @route   GET /api/auth/verify/:token
// @desc    Verify email
// @access  Public
router.get('/verify/:token', authController.verifyEmail);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  loginRules,
  validate,
  authController.login
);

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', authController.forgotPassword);


router.post(
  '/reset-password/:token',
  resetPasswordRules,
  validate,
  authController.resetPassword
);

export default router;