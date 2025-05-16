import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate, emailChangeRules, phoneUpdateRules, passwordChangeRules } from '../middleware/validator.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', userController.getProfile);

// @route   PUT /api/users/username
// @desc    Update username
// @access  Private
router.put(
  '/username',
  validate,
  userController.updateUsername
);

// @route   POST /api/users/email
// @desc    Request email change
// @access  Private
router.post(
  '/email',
  emailChangeRules,
  validate,
  userController.requestEmailChange
);

// @route   GET /api/users/email/confirm/:token
// @desc    Confirm email change
// @access  Public (but requires token)
router.get('/email/confirm/:token', userController.confirmEmailChange);

// @route   PUT /api/users/phone
// @desc    Update phone
// @access  Private
router.put(
  '/phone',
  phoneUpdateRules,
  validate,
  userController.updatePhone
);

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put(
  '/password',
  passwordChangeRules,
  validate,
  userController.changePassword
);

export default router;