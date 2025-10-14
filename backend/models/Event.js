const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    trim: true
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  speaker: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Speaker name cannot exceed 100 characters']
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [150, 'Speaker designation cannot exceed 150 characters']
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Speaker bio cannot exceed 1000 characters']
    },
    image: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    enum: ['workshop', 'seminar', 'competition', 'social', 'meeting', 'other'],
    default: 'other'
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1'],
    max: [1000, 'Maximum attendees cannot exceed 1000']
  },
  registrationRequired: {
    type: Boolean,
    default: true
  },
  registrationDeadline: {
    type: Date,
    validate: {
      validator: function(deadline) {
        return !this.registrationRequired || (deadline && deadline <= this.date);
      },
      message: 'Registration deadline must be before the event date'
    }
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Image caption cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  rsvps: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rsvpDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'tentative', 'cancelled'],
      default: 'confirmed'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ 'rsvps.user': 1 });

// Virtual for RSVP count
eventSchema.virtual('rsvpCount').get(function() {
  return this.rsvps ? this.rsvps.filter(rsvp => rsvp.status === 'confirmed').length : 0;
});

// Virtual for remaining spots
eventSchema.virtual('spotsRemaining').get(function() {
  if (!this.maxAttendees) return null;
  const confirmedRsvps = this.rsvps ? this.rsvps.filter(rsvp => rsvp.status === 'confirmed').length : 0;
  return Math.max(0, this.maxAttendees - confirmedRsvps);
});

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function() {
  return this.find({
    date: { $gte: new Date() },
    status: 'upcoming',
    isActive: true
  }).sort({ date: 1 });
};

// Static method to find past events
eventSchema.statics.findPast = function() {
  return this.find({
    date: { $lt: new Date() },
    isActive: true
  }).sort({ date: -1 });
};

// Instance method to check if user has RSVP'd
eventSchema.methods.hasUserRsvp = function(userId) {
  return this.rsvps.some(rsvp => 
    rsvp.user.toString() === userId.toString() && rsvp.status === 'confirmed'
  );
};

// Instance method to add RSVP
eventSchema.methods.addRsvp = function(userId) {
  // Check if user already has an RSVP
  const existingRsvp = this.rsvps.find(rsvp => rsvp.user.toString() === userId.toString());
  
  if (existingRsvp) {
    existingRsvp.status = 'confirmed';
    existingRsvp.rsvpDate = new Date();
  } else {
    this.rsvps.push({
      user: userId,
      status: 'confirmed',
      rsvpDate: new Date()
    });
  }
  
  return this.save();
};

// Instance method to cancel RSVP
eventSchema.methods.cancelRsvp = function(userId) {
  const rsvpIndex = this.rsvps.findIndex(rsvp => rsvp.user.toString() === userId.toString());
  
  if (rsvpIndex !== -1) {
    this.rsvps[rsvpIndex].status = 'cancelled';
    return this.save();
  }
  
  throw new Error('RSVP not found');
};

// Ensure virtuals are included when converting to JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);