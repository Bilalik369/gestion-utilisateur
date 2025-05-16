import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file are protected and require admin role
router.use(protect, admin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', adminController.getUsers);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/users/:id', adminController.getUserById);

// @route   GET /api/admin/logs/user/:id
// @desc    Get user logs
// @access  Private/Admin
router.get('/logs/user/:id', adminController.getUserLogs);

// @route   GET /api/admin/logs
// @desc    Get all logs
// @access  Private/Admin
router.get('/logs', adminController.getAllLogs);

// @route   GET /api/admin/stats
// @desc    Get user stats
// @access  Private/Admin
router.get('/stats', adminController.getUserStats);

export default router;