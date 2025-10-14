const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
    enum: [
      'President',
      'Vice-President', 
      'Faculty Advisor',
      'Director Administration',
      'Secretary',
      'Sponsorship',
      'Media',
      'Joint Secretary',
      'Treasurer',
      'Lady Representative',
      'Management',
      'Representative'
    ]
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true,
    enum: ['BTech', 'TY', 'Btech', 'B.Tech', 'Faculty', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil']
  },
  year: {
    type: String,
    trim: true,
    enum: ['TY', 'FY', 'SY', 'Final Year', 'Alumni', 'Faculty', '1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  profileImage: {
    type: String,
    default: null
  },
  skills: [{
    type: String,
    trim: true
  }],
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCoreTeam: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
memberSchema.index({ designation: 1 });
memberSchema.index({ isActive: 1 });
memberSchema.index({ isCoreTeam: 1 });
memberSchema.index({ displayOrder: 1 });

// Virtual for full name with designation
memberSchema.virtual('fullTitle').get(function() {
  return `${this.name} - ${this.designation}`;
});

// Static method to get core team members
memberSchema.statics.getCoreTeam = function() {
  return this.find({ isActive: true, isCoreTeam: true }).sort({ displayOrder: 1 });
};

// Static method to get members by designation
memberSchema.statics.getByDesignation = function(designation) {
  return this.find({ designation, isActive: true }).sort({ displayOrder: 1 });
};

module.exports = mongoose.model('Member', memberSchema);