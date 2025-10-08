const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

// Mock RSVP data for development
const mockRSVPs = [
  {
    id: '1',
    userId: '68e6a04849aaf68078209510',
    eventId: '1',
    status: 'attending',
    registrationDate: new Date('2024-01-15'),
    user: {
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      studentId: 'ST001',
      department: 'Computer Science',
      year: '3rd'
    },
    event: {
      title: 'React Workshop',
      date: '2024-02-15',
      location: 'Main Auditorium'
    }
  },
  {
    id: '2',
    userId: '68e6a04849aaf68078209511',
    eventId: '2',
    status: 'maybe',
    registrationDate: new Date('2024-01-18'),
    user: {
      name: 'Jane Smith',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      studentId: 'ST002',
      department: 'Information Technology',
      year: '2nd'
    },
    event: {
      title: 'Tech Talk Series',
      date: '2024-02-20',
      location: 'Conference Room A'
    }
  },
  {
    id: '3',
    userId: '68e6a04849aaf68078209512',
    eventId: '1',
    status: 'not_attending',
    registrationDate: new Date('2024-01-20'),
    user: {
      name: 'Mike Johnson',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike@example.com',
      studentId: 'ST003',
      department: 'Electronics',
      year: '4th'
    },
    event: {
      title: 'React Workshop',
      date: '2024-02-15',
      location: 'Main Auditorium'
    }
  }
];

// @route   GET /api/rsvps
// @desc    Get all RSVPs (admin only)
// @access  Private/Admin
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log('Admin fetching all RSVPs');
    
    res.json({
      success: true,
      message: 'RSVPs retrieved successfully',
      data: mockRSVPs
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
    console.log('User fetching own RSVPs:', req.user.userId);
    
    const userRSVPs = mockRSVPs.filter(rsvp => rsvp.userId === req.user.userId);
    
    res.json({
      success: true,
      message: 'User RSVPs retrieved successfully',
      data: userRSVPs
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

    console.log('Creating/updating RSVP:', { userId: req.user.userId, eventId, status });

    // Mock RSVP creation/update
    const rsvp = {
      id: Date.now().toString(),
      userId: req.user.userId,
      eventId,
      status,
      notes: notes || '',
      registrationDate: new Date(),
      user: {
        name: 'Current User',
        email: req.user.email
      },
      event: {
        title: 'Mock Event',
        date: '2024-02-25',
        location: 'Mock Location'
      }
    };

    res.status(201).json({
      success: true,
      message: 'RSVP created successfully',
      data: rsvp
    });
  } catch (error) {
    console.error('Create/Update RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing RSVP'
    });
  }
});

// @route   DELETE /api/rsvps/:eventId
// @desc    Delete RSVP for event
// @access  Private
router.delete('/:eventId', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

    console.log('Deleting RSVP:', { userId: req.user.userId, eventId });

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

    console.log('Getting RSVP stats for event:', eventId);

    const eventRSVPs = mockRSVPs.filter(rsvp => rsvp.eventId === eventId);
    const stats = {
      attending: eventRSVPs.filter(r => r.status === 'attending').length,
      not_attending: eventRSVPs.filter(r => r.status === 'not_attending').length,
      maybe: eventRSVPs.filter(r => r.status === 'maybe').length,
      total: eventRSVPs.length
    };

    res.json({
      success: true,
      message: 'Event RSVP statistics retrieved successfully',
      data: {
        eventId,
        eventTitle: 'Mock Event',
        capacity: 50,
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