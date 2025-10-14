const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gallery item title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Caption cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    metadata: {
      width: Number,
      height: Number,
      size: Number,
      format: String,
      originalName: String
    }
  }],
  category: {
    type: String,
    enum: ['event', 'workshop', 'seminar', 'competition', 'social', 'achievement', 'other'],
    default: 'other'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  eventName: {
    type: String,
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  photographer: {
    type: String,
    trim: true,
    maxlength: [100, 'Photographer name cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative']
  },
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    width: Number,
    height: Number,
    size: Number,
    format: String,
    originalName: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
gallerySchema.index({ category: 1 });
gallerySchema.index({ date: -1 });
gallerySchema.index({ isActive: 1 });
gallerySchema.index({ isFeatured: 1 });
gallerySchema.index({ event: 1 });
gallerySchema.index({ tags: 1 });

// Static method to find featured items
gallerySchema.statics.findFeatured = function() {
  return this.find({
    isFeatured: true,
    isActive: true
  }).sort({ date: -1 });
};

// Static method to find by category
gallerySchema.statics.findByCategory = function(category) {
  return this.find({
    category: category,
    isActive: true
  }).sort({ date: -1 });
};

// Static method to find recent items
gallerySchema.statics.findRecent = function(limit = 10) {
  return this.find({
    isActive: true
  }).sort({ date: -1 }).limit(limit);
};

// Instance method to increment views
gallerySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to toggle like by user
gallerySchema.methods.toggleLike = function(userId) {
  const userIndex = this.likedBy.indexOf(userId);
  
  if (userIndex === -1) {
    // User hasn't liked it, add like
    this.likedBy.push(userId);
    this.likes += 1;
  } else {
    // User has liked it, remove like
    this.likedBy.splice(userIndex, 1);
    this.likes -= 1;
  }
  
  return this.save();
};

// Instance method to check if user has liked
gallerySchema.methods.isLikedBy = function(userId) {
  return this.likedBy.includes(userId);
};

module.exports = mongoose.model('Gallery', gallerySchema);