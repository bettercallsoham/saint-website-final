const Contact = require('../models/Contact');
const { validateContact } = require('../utils/validation');

// Submit contact form
const submitContact = async (req, res) => {
  try {
    // Validate input data
    const { error } = validateContact(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    const contact = new Contact(req.body);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon!',
      data: { contact }
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form',
      error: 'SUBMIT_CONTACT_ERROR'
    });
  }
};

// Get all contact messages (Admin only)
const getAllContacts = async (req, res) => {
  try {
    const { status, category, priority, limit, page } = req.query;
    
    let query = { isActive: true };
    
    // Add filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const contacts = await Contact.find(query)
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Contact.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Contact messages retrieved successfully',
      data: {
        contacts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contact messages',
      error: 'GET_CONTACTS_ERROR'
    });
  }
};

// Get single contact message (Admin only)
const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findOne({ _id: id, isActive: true })
      .populate('respondedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
        error: 'CONTACT_NOT_FOUND'
      });
    }
    
    // Mark as read if it's new
    if (contact.status === 'new') {
      await contact.markAsRead();
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact message retrieved successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contact message',
      error: 'GET_CONTACT_ERROR'
    });
  }
};

// Respond to contact message (Admin only)
const respondToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    
    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response is required',
        error: 'RESPONSE_REQUIRED'
      });
    }
    
    const contact = await Contact.findOne({ _id: id, isActive: true });
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
        error: 'CONTACT_NOT_FOUND'
      });
    }
    
    await contact.addResponse(response, req.user._id);
    
    const updatedContact = await Contact.findById(id)
      .populate('respondedBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      data: { contact: updatedContact }
    });
  } catch (error) {
    console.error('Respond to contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to contact message',
      error: 'RESPOND_CONTACT_ERROR'
    });
  }
};

// Update contact status (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    
    const contact = await Contact.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).populate('respondedBy', 'name email');
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found',
        error: 'CONTACT_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status',
      error: 'UPDATE_CONTACT_STATUS_ERROR'
    });
  }
};

// Get contact statistics (Admin only)
const getContactStats = async (req, res) => {
  try {
    const stats = await Contact.getStats();
    
    res.status(200).json({
      success: true,
      message: 'Contact statistics retrieved successfully',
      data: { stats }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contact statistics',
      error: 'GET_CONTACT_STATS_ERROR'
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  respondToContact,
  updateContactStatus,
  getContactStats
};