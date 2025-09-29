const express = require('express');
const membersController = require('../controllers/membersController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateMongoId } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/common');

const router = express.Router();

// Apply rate limiting to all members routes
router.use(generalLimiter);

/**
 * @route   GET /api/members
 * @desc    Get all members
 * @access  Public
 */
router.get('/', membersController.getAllMembers);

/**
 * @route   GET /api/members/:id
 * @desc    Get member by ID
 * @access  Public
 */
router.get('/:id', validateMongoId, membersController.getMemberById);

/**
 * @route   POST /api/members
 * @desc    Create a new member
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, membersController.createMember);

module.exports = router;
