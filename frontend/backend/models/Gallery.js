const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gallery title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Gallery category is required'],
    enum: ['Hackathon', 'Workshop', 'Networking', 'Training', 'Awards', 'Conference', 'Social', 'Other']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  date: {
    type: Date,
    required: [true, 'Gallery date is required']
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  participantCount: {
    type: Number,
    default: 0
  },
  highlights: [String],
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update participant count when participants array changes
gallerySchema.pre('save', function(next) {
  this.participantCount = this.participants.length;
  this.likeCount = this.likes.length;
  next();
});

// Index for better query performance
gallerySchema.index({ category: 1, isFeatured: 1, date: -1 });
gallerySchema.index({ isActive: 1, isFeatured: 1 });
gallerySchema.index({ tags: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);