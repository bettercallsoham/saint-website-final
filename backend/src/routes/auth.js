const express = require('express');
const authController = require('../controllers/authController');
const { 
  validateUserRegistration, 
  validateAdminRegistration, 
  validateUserLogin,
  validateTokenRefresh 
} = require('../middleware/validation');
const { validateAdminSecret, authenticate } = require('../middleware/auth');

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
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

module.exports = router;
