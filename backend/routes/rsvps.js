const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

// @route   GET /api/rsvps
// @desc    Get all RSVPs (admin only)
// @access  Private/Admin
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const rsvps = await RSVP.find()
      .populate('user', 'name firstName lastName email studentId department year')
      .populate('event', 'title date location category')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      message: 'RSVPs retrieved successfully',
      data: rsvps
    });
  } catch (error) {
    console.error('Get all RSVPs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving RSVPs'
    });
  }
});

// @route   GET /api/rsvps/user
// @desc    Get current user's RSVPs
// @access  Private
router.get('/user', authenticate, async (req, res) => {
  try {
    const rsvps = await RSVP.find({ user: req.user.userId })
      .populate('event', 'title description date time location category speaker capacity')
      .sort({ registrationDate: -1 });

    res.json({
      success: true,
      message: 'User RSVPs retrieved successfully',
      data: rsvps
    });
  } catch (error) {
    console.error('Get user RSVPs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving user RSVPs'
    });
  }
});

// @route   POST /api/rsvps
// @desc    Create or update RSVP
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { eventId, status, notes } = req.body;

    // Validate required fields
    if (!eventId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and status are required'
      });
    }

    // Validate status
    if (!['attending', 'not_attending', 'maybe'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be attending, not_attending, or maybe'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is in the future
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot RSVP to past events'
      });
    }

    // Check capacity if attending
    if (status === 'attending' && event.capacity) {
      const attendingCount = await RSVP.countDocuments({
        event: eventId,
        status: 'attending'
      });

      if (attendingCount >= event.capacity) {
        return res.status(400).json({
          success: false,
          message: 'Event is at full capacity'
        });
      }
    }

    // Find existing RSVP or create new one
    let rsvp = await RSVP.findOne({
      user: req.user.userId,
      event: eventId
    });

    if (rsvp) {
      // Update existing RSVP
      rsvp.status = status;
      if (notes !== undefined) rsvp.notes = notes;
      await rsvp.save();
    } else {
      // Create new RSVP
      rsvp = new RSVP({
        user: req.user.userId,
        event: eventId,
        status,
        notes
      });
      await rsvp.save();
    }

    // Populate the response
    await rsvp.populate('user', 'name firstName lastName email studentId department year');
    await rsvp.populate('event', 'title date location category');

    res.status(201).json({
      success: true,
      message: `RSVP ${rsvp.isNew ? 'created' : 'updated'} successfully`,
      data: rsvp
    });
  } catch (error) {
    console.error('Create/Update RSVP error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'RSVP already exists for this event'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while processing RSVP'
    });
  }
});

// @route   DELETE /api/rsvps/:eventId
// @desc    Delete RSVP for event
// @access  Private
router.delete('/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    const rsvp = await RSVP.findOneAndDelete({
      user: req.user.userId,
      event: eventId
    });

    if (!rsvp) {
      return res.status(404).json({
        success: false,
        message: 'RSVP not found'
      });
    }

    res.json({
      success: true,
      message: 'RSVP cancelled successfully'
    });
  } catch (error) {
    console.error('Delete RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling RSVP'
    });
  }
});

// @route   GET /api/rsvps/event/:eventId/stats
// @desc    Get RSVP statistics for an event
// @access  Private
router.get('/event/:eventId/stats', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const stats = await RSVP.getEventStats(eventId);

    res.json({
      success: true,
      message: 'Event RSVP statistics retrieved successfully',
      data: {
        eventId,
        eventTitle: event.title,
        capacity: event.capacity,
        stats
      }
    });
  } catch (error) {
    console.error('Get event RSVP stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving RSVP statistics'
    });
  }
});

module.exports = router;