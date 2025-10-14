const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  registerAdmin,
  login,
  getProfile,
  updateProfile,
  logout
} = require('../controllers/authController');

// Admin authentication routes
router.post('/register', registerAdmin);
router.post('/login', login);
router.post('/logout', authenticate, logout);

// Admin profile routes
router.get('/profile', authenticate, requireAdmin, getProfile);
router.put('/profile', authenticate, requireAdmin, updateProfile);
router.get('/me', authenticate, requireAdmin, getProfile);

module.exports = router;