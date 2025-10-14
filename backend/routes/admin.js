const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getDetailedAnalytics,
  getActivitySummary
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Admin dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getDetailedAnalytics);
router.get('/activity', getActivitySummary);

module.exports = router;