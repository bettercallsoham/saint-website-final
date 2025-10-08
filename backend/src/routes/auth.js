const express = require('express');
const authController = require('../controllers/authController');
const { 
  validateUserRegistration, 
  validateAdminRegistration, 
  validateUserLogin,
  validateTokenRefresh 
} = require('../middleware/validation');
const { validateAdminSecret, authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateUserRegistration, authController.register);

/**
 * @route   POST /api/auth/admin/register  
 * @desc    Register an admin user (requires admin secret)
 * @access  Public (but requires admin secret)
 */
router.post('/admin/register', validateAdminRegistration, validateAdminSecret, authController.adminRegister);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateUserLogin, authController.login);

/**
 * @route   POST /api/auth/token
 * @desc    Generate new access token using refresh token
 * @access  Public
 */
router.post('/token', validateTokenRefresh, authController.refreshToken);

/**
 * @route   POST /api/auth/validate
 * @desc    Validate access token
 * @access  Public
 */
router.post('/validate', authController.validateToken);

/**
 * @route   GET /api/auth/token-info
 * @desc    Get token information
 * @access  Public
 */
router.get('/token-info', authController.getTokenInfo);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile (alias for /me)
 * @access  Private
 */
router.get('/profile', authenticate, authController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, authController.updateProfile);

/**
 * @route   GET /api/auth/admin/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get('/admin/users', authenticate, requireAdmin, authController.getAllUsers);

/**
 * @route   GET /api/auth/admin/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private (Admin)
 */
router.get('/admin/users/:id', authenticate, requireAdmin, authController.getUserById);

/**
 * @route   PUT /api/auth/admin/users/:id/role
 * @desc    Update user role (admin only)
 * @access  Private (Admin)
 */
router.put('/admin/users/:id/role', authenticate, requireAdmin, authController.updateUserRole);

/**
 * @route   PUT /api/auth/admin/users/:id/status
 * @desc    Update user status (admin only)
 * @access  Private (Admin)
 */
router.put('/admin/users/:id/status', authenticate, requireAdmin, authController.updateUserStatus);

/**
 * @route   DELETE /api/auth/admin/users/:id
 * @desc    Delete user (admin only)
 * @access  Private (Admin)
 */
router.delete('/admin/users/:id', authenticate, requireAdmin, authController.deleteUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
