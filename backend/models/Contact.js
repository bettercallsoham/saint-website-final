const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^[+]?[\d\s()-]{10,}$/, 'Please provide a valid phone number']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'event', 'membership', 'complaint', 'suggestion'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  response: {
    type: String,
    trim: true
  },
  responseDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contactSchema.index({ status: 1 });
contactSchema.index({ priority: 1 });
contactSchema.index({ category: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ isActive: 1 });

// Static method to find unread messages
contactSchema.statics.findUnread = function() {
  return this.find({
    status: 'new',
    isActive: true
  }).sort({ createdAt: -1 });
};

// Static method to find by status
contactSchema.statics.findByStatus = function(status) {
  return this.find({
    status: status,
    isActive: true
  }).sort({ createdAt: -1 });
};

// Static method to get statistics
contactSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    resolved: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

// Instance method to mark as read
contactSchema.methods.markAsRead = function() {
  if (this.status === 'new') {
    this.status = 'read';
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to add response
contactSchema.methods.addResponse = function(responseText, responderId) {
  this.response = responseText;
  this.responseDate = new Date();
  this.respondedBy = responderId;
  this.status = 'replied';
  return this.save();
};

module.exports = mongoose.model('Contact', contactSchema);