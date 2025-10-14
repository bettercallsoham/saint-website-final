const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  registerUser,
  login,
  getProfile,
  updateProfile,
  logout
} = require('../controllers/authController');

// User authentication routes
router.post('/register', registerUser);
router.post('/login', login);
router.post('/logout', authenticate, logout);

// User profile routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/me', authenticate, getProfile);

module.exports = router;