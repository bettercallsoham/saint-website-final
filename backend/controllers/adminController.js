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

// User Management Functions

// Get all users for admin management
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', department = '', year = '' } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      filter.role = role;
    }
    
    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }
    
    if (year) {
      filter.year = year;
    }
    
    // Calculate pagination
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;
    
    // Get users with pagination
    const users = await User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ joinedAt: -1 })
      .skip(skip)
      .limit(pageSize);
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalUsers / pageSize),
          totalUsers,
          hasNext: pageNumber < Math.ceil(totalUsers / pageSize),
          hasPrev: pageNumber > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: 'GET_USERS_ERROR'
    });
  }
};

// Get single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: 'GET_USER_ERROR'
    });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"',
        error: 'INVALID_ROLE'
      });
    }
    
    const user = await User.findById(id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user: user.toPublicJSON() }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: 'UPDATE_ROLE_ERROR'
    });
  }
};

// Update user details (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, studentId, department, year } = req.body;
    
    const user = await User.findById(id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
          error: 'EMAIL_EXISTS'
        });
      }
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (studentId !== undefined) user.studentId = studentId;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.toPublicJSON() }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: 'UPDATE_USER_ERROR'
    });
  }
};

// Ban user (set status to banned)
const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Violating community guidelines' } = req.body;
    
    const user = await User.findById(id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    // Don't allow admins to ban themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban your own account',
        error: 'CANNOT_BAN_SELF'
      });
    }
    
    // Don't allow banning other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban another admin',
        error: 'CANNOT_BAN_ADMIN'
      });
    }
    
    await user.ban();
    
    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: { 
        user: user.toPublicJSON(),
        reason 
      }
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error banning user',
      error: 'BAN_USER_ERROR'
    });
  }
};

// Unban user (set status back to active)
const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    await user.unban();
    
    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      data: { user: user.toPublicJSON() }
    });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unbanning user',
      error: 'UNBAN_USER_ERROR'
    });
  }
};

// Deactivate user (soft delete)
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    // Don't allow admins to deactivate themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account',
        error: 'CANNOT_DEACTIVATE_SELF'
      });
    }
    
    user.isActive = false;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: { user: user.toPublicJSON() }
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user',
      error: 'DEACTIVATE_USER_ERROR'
    });
  }
};

// Delete user permanently (hard delete)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    // Don't allow admins to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
        error: 'CANNOT_DELETE_SELF'
      });
    }
    
    // Don't allow deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete another admin',
        error: 'CANNOT_DELETE_ADMIN'
      });
    }
    
    // Permanently delete the user from database
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'User deleted permanently',
      data: { deletedUserId: id, email: user.email }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: 'DELETE_USER_ERROR'
    });
  }
};

// Reactivate user
const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    
    user.isActive = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User reactivated successfully',
      data: { user: user.toPublicJSON() }
    });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reactivating user',
      error: 'REACTIVATE_USER_ERROR'
    });
  }
};

module.exports = {
  getDashboardStats,
  getDetailedAnalytics,
  getActivitySummary,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUser,
  banUser,
  unbanUser,
  deactivateUser,
  reactivateUser,
  deleteUser
};