const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Event unique identifier
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           description: Event title
 *           example: React Workshop
 *         description:
 *           type: string
 *           description: Event description
 *           example: Learn React fundamentals and best practices
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Event start date and time
 *           example: 2024-02-15T10:00:00Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: Event end date and time
 *           example: 2024-02-15T17:00:00Z
 *         location:
 *           type: string
 *           description: Event location
 *           example: Computer Lab 101
 *         category:
 *           type: string
 *           enum: [workshop, hackathon, seminar, meeting, social, competition, other]
 *           description: Event category
 *           example: workshop
 *         maxParticipants:
 *           type: number
 *           description: Maximum number of participants
 *           example: 50
 *         registeredCount:
 *           type: number
 *           description: Current number of registered participants
 *           example: 25
 *         isActive:
 *           type: boolean
 *           description: Event status
 *           example: true
 *         organizer:
 *           type: string
 *           description: Organizer user ID
 *           example: 507f1f77bcf86cd799439011
 *         registeredUsers:
 *           type: array
 *           items:
 *             type: string
 *           description: List of registered user IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [workshop, hackathon, seminar, meeting, social, competition, other]
 *         description: Filter by event category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, past]
 *         description: Filter by event status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of events per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in event title and description
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 25
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 3
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error
 */
// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      status,
      page = 1,
      limit = 10,
      search,
      featured
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) query.category = category;
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'speaker.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('registeredUsers', 'name email studentId year department')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: events.length,
      total,
      currentPage: parseInt(page),
      totalPages,
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('registeredUsers', 'name email studentId year department')
      .populate('waitlistUsers', 'name email studentId year department');

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *               - location
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: React Workshop
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Learn React fundamentals and best practices
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-02-15T10:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-02-15T17:00:00Z
 *               location:
 *                 type: string
 *                 example: Computer Lab 101
 *               category:
 *                 type: string
 *                 enum: [workshop, hackathon, seminar, meeting, social, competition, other]
 *                 example: workshop
 *               maxParticipants:
 *                 type: number
 *                 minimum: 1
 *                 example: 50
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Event created successfully
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: title
 *                       message:
 *                         type: string
 *                         example: Title must be between 5 and 100 characters
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Not authorized to access this route
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error
 */
// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin/Faculty)
router.post('/', protect, authorize('admin', 'faculty'), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['Workshop', 'Hackathon', 'Seminar', 'Networking', 'Competition', 'Conference', 'Training', 'Other']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('time').notEmpty().withMessage('Time is required'),
  body('location').trim().isLength({ min: 5, max: 200 }).withMessage('Location must be between 5 and 200 characters'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  body('speaker.name').notEmpty().withMessage('Speaker name is required'),
  body('speaker.role').notEmpty().withMessage('Speaker role is required')
], async (req, res) => {
  try {
    console.log('Create event request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Event validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      date: new Date(req.body.date),
      time: req.body.time,
      location: req.body.location,
      capacity: parseInt(req.body.capacity),
      speaker: {
        name: req.body.speaker?.name || '',
        role: req.body.speaker?.role || '',
        company: req.body.speaker?.company || '',
        bio: req.body.speaker?.bio || ''
      },
      createdBy: req.user.id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during event creation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Check if event is full
    if (event.registeredCount >= event.capacity) {
      // Add to waitlist
      event.waitlistUsers.push(req.user.id);
      await event.save();

      return res.json({
        success: true,
        message: 'Added to waitlist',
        status: 'waitlist'
      });
    }

    // Register for event
    event.registeredUsers.push(req.user.id);
    event.registeredCount = event.registeredUsers.length;
    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for event',
      status: 'registered'
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
router.delete('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Remove from registered users
    event.registeredUsers = event.registeredUsers.filter(
      userId => userId.toString() !== req.user.id.toString()
    );

    // Remove from waitlist
    event.waitlistUsers = event.waitlistUsers.filter(
      userId => userId.toString() !== req.user.id.toString()
    );

    event.registeredCount = event.registeredUsers.length;
    await event.save();

    res.json({
      success: true,
      message: 'Successfully unregistered from event'
    });
  } catch (error) {
    console.error('Unregister from event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/Faculty)
router.put('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/Faculty)
router.delete('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// @desc    Get event statistics
// @route   GET /api/events/stats/overview
// @access  Private (Admin/Faculty)
router.get('/stats/overview', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({
      startDate: { $gte: new Date() }
    });
    const pastEvents = await Event.countDocuments({
      endDate: { $lt: new Date() }
    });
    
    const totalRegistrations = await Event.aggregate([
      { $unwind: '$registeredUsers' },
      { $count: 'total' }
    ]);

    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title startDate category registeredCount')
      .populate('registeredUsers', 'name email');

    res.json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        pastEvents,
        totalRegistrations: totalRegistrations[0]?.total || 0,
        eventsByCategory,
        recentEvents
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event statistics'
    });
  }
});

module.exports = router;
