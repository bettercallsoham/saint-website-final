const apiService = require('../utils/apiService');

class EventsController {
  /**
   * Get all events
   */
  async getAllEvents(req, res) {
    try {
      console.log('Fetching all events via external API');
      
      const result = await apiService.getAllEvents();
      
      console.log('Events fetched successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch events',
        error: 'FETCH_EVENTS_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Get event by ID
   */
  async getEventById(req, res) {
    try {
      const { id } = req.params;
      
      console.log('Fetching event by ID via external API', { eventId: id });
      
      const result = await apiService.getEventById(id);
      
      console.log('Event fetched successfully via external API', { eventId: id });
      
      res.json(result.data);

    } catch (error) {
      console.error('Get event by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch event',
        error: 'FETCH_EVENT_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Create a new event (admin only)
   */
  async createEvent(req, res) {
    try {
      const eventData = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      
      console.log('Creating event via external API', { title: eventData.title });
      
      const result = await apiService.createEvent(eventData, token);
      
      console.log('Event created successfully via external API', { title: eventData.title });
      
      res.status(201).json(result.data);

    } catch (error) {
      console.error('Create event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create event',
        error: 'CREATE_EVENT_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Update event (admin only)
   */
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const eventData = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      
      console.log('Updating event via external API', { eventId: id });
      
      const result = await apiService.updateEvent(id, eventData, token);
      
      console.log('Event updated successfully via external API', { eventId: id });
      
      res.json(result.data);

    } catch (error) {
      console.error('Update event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update event',
        error: 'UPDATE_EVENT_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Delete event (admin only)
   */
  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(' ')[1];
      
      console.log('Deleting event via external API', { eventId: id });
      
      const result = await apiService.deleteEvent(id, token);
      
      console.log('Event deleted successfully via external API', { eventId: id });
      
      res.json(result.data);

    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete event',
        error: 'DELETE_EVENT_ERROR',
        details: error.error || error.message
      });
    }
  }
}

module.exports = new EventsController();
