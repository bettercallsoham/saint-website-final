const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  submitContact,
  getAllContacts,
  getContactById,
  respondToContact,
  updateContactStatus,
  getContactStats
} = require('../controllers/contactController');

// Public routes
router.post('/', submitContact);

// Admin only routes
router.get('/', authenticate, requireAdmin, getAllContacts);
router.get('/stats', authenticate, requireAdmin, getContactStats);
router.get('/:id', authenticate, requireAdmin, getContactById);
router.post('/:id/respond', authenticate, requireAdmin, respondToContact);
router.patch('/:id/status', authenticate, requireAdmin, updateContactStatus);

module.exports = router;