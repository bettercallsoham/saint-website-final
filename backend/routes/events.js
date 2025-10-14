const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  cancelRsvp,
  getEventRsvps
} = require('../controllers/eventsController');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Protected routes (authenticated users)
router.post('/:id/rsvp', authenticate, rsvpToEvent);
router.delete('/:id/rsvp', authenticate, cancelRsvp);

// Admin only routes
router.post('/', authenticate, requireAdmin, createEvent);
router.put('/:id', authenticate, requireAdmin, updateEvent);
router.delete('/:id', authenticate, requireAdmin, deleteEvent);
router.get('/:id/rsvps', authenticate, requireAdmin, getEventRsvps);

module.exports = router;