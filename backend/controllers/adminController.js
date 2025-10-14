const User = require('../models/User');
const Event = require('../models/Event');
const Gallery = require('../models/Gallery');
const Contact = require('../models/Contact');

// Get admin dashboard overview
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalMembers = await User.countDocuments({ isActive: true });
    const totalEvents = await Event.countDocuments({ isActive: true });
    const totalGalleryItems = await Gallery.countDocuments({ isActive: true });
    const totalContacts = await Contact.countDocuments({ isActive: true });
    
    // Get recent data
    const recentEvents = await Event.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title date status rsvps');
    
    const recentMembers = await User.find({ isActive: true })
      .sort({ joinedAt: -1 })
      .limit(5)
      .select('name email joinedAt department');
    
    const unreadContacts = await Contact.countDocuments({ 
      status: 'new',
      isActive: true 
    });
    
    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      status: 'upcoming',
      isActive: true
    }).sort({ date: 1 }).limit(5);
    
    // Calculate RSVP statistics for upcoming events
    const eventStats = upcomingEvents.map(event => ({
      id: event._id,
      title: event.title,
      date: event.date,
      rsvpCount: event.rsvpCount,
      maxAttendees: event.maxAttendees,
      spotsRemaining: event.spotsRemaining
    }));
    
    // Get monthly data for charts (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const monthlyMemberStats = await User.aggregate([
      {
        $match: {
          joinedAt: { $gte: twelveMonthsAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$joinedAt' },
            month: { $month: '$joinedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    const monthlyEventStats = await Event.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        overview: {
          totalMembers,
          totalEvents,
          totalGalleryItems,
          totalContacts,
          unreadContacts
        },
        recentActivity: {
          recentEvents,
          recentMembers
        },
        upcomingEvents: eventStats,
        charts: {
          monthlyMembers: monthlyMemberStats,
          monthlyEvents: monthlyEventStats
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard statistics',
      error: 'GET_DASHBOARD_STATS_ERROR'
    });
  }
};

// Get detailed analytics
const getDetailedAnalytics = async (req, res) => {
  try {
    // Event analytics
    const eventAnalytics = await Event.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRsvps: { $sum: { $size: '$rsvps' } },
          avgRsvps: { $avg: { $size: '$rsvps' } }
        }
      }
    ]);
    
    // Member analytics by year and department
    const membersByYear = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$year',
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    const membersByDepartment = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { 'count': -1 } }
    ]);
    
    // Gallery analytics
    const galleryAnalytics = await Gallery.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalViews: { $sum: '$views' }
        }
      }
    ]);
    
    // Contact analytics
    const contactAnalytics = await Contact.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Detailed analytics retrieved successfully',
      data: {
        events: eventAnalytics,
        members: {
          byYear: membersByYear,
          byDepartment: membersByDepartment
        },
        gallery: galleryAnalytics,
        contacts: contactAnalytics
      }
    });
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving detailed analytics',
      error: 'GET_ANALYTICS_ERROR'
    });
  }
};

// Get admin activity summary
const getActivitySummary = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    
    // Recent activities
    const recentEvents = await Event.find({
      createdAt: { $gte: daysAgo },
      isActive: true
    }).sort({ createdAt: -1 }).limit(10);
    
    const recentGalleryItems = await Gallery.find({
      createdAt: { $gte: daysAgo },
      isActive: true
    }).sort({ createdAt: -1 }).limit(10);
    
    const recentMembers = await User.find({
      joinedAt: { $gte: daysAgo },
      isActive: true
    }).sort({ joinedAt: -1 }).limit(10);
    
    const recentContacts = await Contact.find({
      createdAt: { $gte: daysAgo },
      isActive: true
    }).sort({ createdAt: -1 }).limit(10);
    
    res.status(200).json({
      success: true,
      message: 'Activity summary retrieved successfully',
      data: {
        period: `Last ${days} days`,
        activities: {
          events: recentEvents.length,
          galleryItems: recentGalleryItems.length,
          newMembers: recentMembers.length,
          contacts: recentContacts.length
        },
        recent: {
          events: recentEvents,
          galleryItems: recentGalleryItems,
          members: recentMembers,
          contacts: recentContacts
        }
      }
    });
  } catch (error) {
    console.error('Get activity summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving activity summary',
      error: 'GET_ACTIVITY_SUMMARY_ERROR'
    });
  }
};

module.exports = {
  getDashboardStats,
  getDetailedAnalytics,
  getActivitySummary
};