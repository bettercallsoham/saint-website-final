const express = require('express');
const databaseController = require('../controllers/databaseController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { generalLimiter } = require('../middleware/common');

const router = express.Router();

// Apply rate limiting to all database routes
router.use(generalLimiter);

/**
 * @route   GET /api/database/status
 * @desc    Get database connection status
 * @access  Public
 */
router.get('/status', databaseController.getStatus);

/**
 * @route   POST /api/database/connect
 * @desc    Connect to database
 * @access  Private (Admin only)
 */
router.post('/connect', authenticate, requireAdmin, databaseController.connect);

/**
 * @route   POST /api/database/disconnect
 * @desc    Disconnect from database
 * @access  Private (Admin only)
 */
router.post('/disconnect', authenticate, requireAdmin, databaseController.disconnect);

/**
 * @route   GET /api/database/test
 * @desc    Test database operations
 * @access  Public
 */
router.get('/test', databaseController.test);

module.exports = router;
