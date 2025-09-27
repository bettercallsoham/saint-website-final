const express = require('express');
const eventsController = require('../controllers/eventsController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateEventCreation, validateMongoId } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/common');

const router = express.Router();

// Apply rate limiting to all events routes
router.use(generalLimiter);

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Public
 */
router.get('/', eventsController.getAllEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', validateMongoId, eventsController.getEventById);

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, validateEventCreation, eventsController.createEvent);

/**
 * @route   PUT /api/events/:id
 * @desc    Update an event
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, validateMongoId, validateEventCreation, eventsController.updateEvent);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, validateMongoId, eventsController.deleteEvent);

module.exports = router;
