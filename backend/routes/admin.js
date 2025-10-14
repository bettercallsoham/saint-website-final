const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getDetailedAnalytics,
  getActivitySummary,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUser,
  deactivateUser,
  reactivateUser
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Admin dashboard routes
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getDetailedAnalytics);
router.get('/activity', getActivitySummary);

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deactivateUser);
router.post('/users/:id/reactivate', reactivateUser);

module.exports = router;