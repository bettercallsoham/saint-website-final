const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['attending', 'not_attending', 'maybe'],
    required: true,
    default: 'attending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index to ensure one RSVP per user per event
rsvpSchema.index({ user: 1, event: 1 }, { unique: true });

// Instance methods
rsvpSchema.methods.toJSON = function() {
  const rsvp = this.toObject();
  rsvp.id = rsvp._id;
  delete rsvp._id;
  delete rsvp.__v;
  return rsvp;
};

// Static methods
rsvpSchema.statics.getEventStats = async function(eventId) {
  const stats = await this.aggregate([
    { $match: { event: new mongoose.Types.ObjectId(eventId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    attending: 0,
    not_attending: 0,
    maybe: 0,
    total: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

rsvpSchema.statics.getUserEventStatus = async function(userId, eventId) {
  return await this.findOne({
    user: userId,
    event: eventId
  }).populate('event', 'title date location');
};

module.exports = mongoose.model('RSVP', rsvpSchema);