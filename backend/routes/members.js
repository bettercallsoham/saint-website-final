const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getAllMembers,
  getMemberById,
  deleteMember,
  getMemberStats
} = require('../controllers/membersController');

// Public routes
router.get('/', getAllMembers);
router.get('/:id', getMemberById);

// Admin only routes
router.delete('/:id', authenticate, requireAdmin, deleteMember);
router.get('/stats/overview', authenticate, requireAdmin, getMemberStats);

module.exports = router;