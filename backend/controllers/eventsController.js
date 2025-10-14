const Event = require('../models/Event');
const { validateEvent } = require('../utils/validation');

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const { status, category, upcoming, past, limit, page } = req.query;
    
    let query = { isActive: true };
    
    // Add filters
    if (status) query.status = status;
    if (category) query.category = category;
    
    // Handle upcoming/past filter
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = 'upcoming';
    } else if (past === 'true') {
      query.date = { $lt: new Date() };
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .sort(upcoming === 'true' ? { date: 1 } : { date: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: {
        events,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving events',
      error: 'GET_EVENTS_ERROR'
    });
  }
};

// Get single event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findOne({ _id: id, isActive: true })
      .populate('createdBy', 'name email')
      .populate('rsvps.user', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving event',
      error: 'GET_EVENT_ERROR'
    });
  }
};

// Create new event (Admin only)
const createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);
    
    // Validate input data
    const { error } = validateEvent(req.body);
    if (error) {
      console.log('Validation error:', error.details[0]);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    const eventData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    const event = new Event(eventData);
    await event.save();
    
    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event: populatedEvent }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: 'CREATE_EVENT_ERROR'
    });
  }
};

// Update event (Admin only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate input data
    const { error } = validateEvent(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    const event = await Event.findOneAndUpdate(
      { _id: id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: 'UPDATE_EVENT_ERROR'
    });
  }
};

// Delete event (Admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: 'DELETE_EVENT_ERROR'
    });
  }
};

// RSVP to event (Authenticated users)
const rsvpToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const event = await Event.findOne({ _id: id, isActive: true });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }
    
    // Check if event is in the future
    if (event.date < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot RSVP to past events',
        error: 'PAST_EVENT'
      });
    }
    
    // Check if registration is required and still open
    if (event.registrationRequired && event.registrationDeadline < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
        error: 'REGISTRATION_CLOSED'
      });
    }
    
    // Check if event is full
    if (event.maxAttendees && event.rsvpCount >= event.maxAttendees) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
        error: 'EVENT_FULL'
      });
    }
    
    // Check if user already has an RSVP
    if (event.hasUserRsvp(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You have already RSVP\'d to this event',
        error: 'ALREADY_RSVP'
      });
    }
    
    // Add RSVP
    await event.addRsvp(userId);
    
    const updatedEvent = await Event.findById(id)
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'RSVP added successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding RSVP',
      error: 'RSVP_ERROR'
    });
  }
};

// Cancel RSVP (Authenticated users)
const cancelRsvp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const event = await Event.findOne({ _id: id, isActive: true });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }
    
    // Cancel RSVP
    await event.cancelRsvp(userId);
    
    const updatedEvent = await Event.findById(id)
      .populate('createdBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'RSVP cancelled successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Cancel RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling RSVP',
      error: 'CANCEL_RSVP_ERROR'
    });
  }
};

// Get event RSVPs (Admin only)
const getEventRsvps = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findOne({ _id: id, isActive: true })
      .populate('rsvps.user', 'name email phoneNumber studentId');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }
    
    const confirmedRsvps = event.rsvps.filter(rsvp => rsvp.status === 'confirmed');
    
    res.status(200).json({
      success: true,
      message: 'Event RSVPs retrieved successfully',
      data: {
        eventTitle: event.title,
        totalRsvps: confirmedRsvps.length,
        rsvps: confirmedRsvps
      }
    });
  } catch (error) {
    console.error('Get RSVPs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving RSVPs',
      error: 'GET_RSVPS_ERROR'
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
  cancelRsvp,
  getEventRsvps
};