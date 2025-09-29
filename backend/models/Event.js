const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Workshop', 'Hackathon', 'Seminar', 'Networking', 'Competition', 'Conference', 'Training', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  registrationStatus: {
    type: String,
    enum: ['open', 'closed', 'full', 'waitlist'],
    default: 'open'
  },
  speaker: {
    name: {
      type: String,
      required: [true, 'Speaker name is required']
    },
    role: {
      type: String,
      required: [true, 'Speaker role is required']
    },
    company: String,
    bio: String,
    image: String,
    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String
    }
  },
  requirements: [String],
  highlights: [String],
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  price: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  waitlistUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update registration status based on capacity
eventSchema.pre('save', function(next) {
  if (this.registeredCount >= this.capacity) {
    this.registrationStatus = 'full';
  } else if (this.registeredCount >= this.capacity * 0.8) {
    this.registrationStatus = 'waitlist';
  } else {
    this.registrationStatus = 'open';
  }
  next();
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.capacity - this.registeredCount;
});

module.exports = mongoose.model('Event', eventSchema);
