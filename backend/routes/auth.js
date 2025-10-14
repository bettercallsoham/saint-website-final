const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  registerUser,
  registerAdmin,
  login,
  getProfile,
  updateProfile,
  logout
} = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/admin/register', registerAdmin);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.post('/logout', authenticate, logout);

// Route for getting current user info (alias for profile)
router.get('/me', authenticate, getProfile);

module.exports = router;