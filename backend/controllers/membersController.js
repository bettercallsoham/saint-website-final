const User = require('../models/User');

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const { year, department, limit, page } = req.query;
    
    let query = { isActive: true };
    
    // Add filters
    if (year) query.year = year;
    if (department) query.department = department;
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    const members = await User.find(query)
      .select('name email phoneNumber studentId department year joinedAt profilePicture')
      .sort({ joinedAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Members retrieved successfully',
      data: {
        members,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving members',
      error: 'GET_MEMBERS_ERROR'
    });
  }
};

// Get single member by ID
const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const member = await User.findOne({ _id: id, isActive: true })
      .select('name email phoneNumber studentId department year joinedAt profilePicture');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
        error: 'MEMBER_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Member retrieved successfully',
      data: { member }
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving member',
      error: 'GET_MEMBER_ERROR'
    });
  }
};

// Delete member (Admin only)
const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
        error: 'CANNOT_DELETE_SELF'
      });
    }
    
    const member = await User.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
        error: 'MEMBER_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting member',
      error: 'DELETE_MEMBER_ERROR'
    });
  }
};

// Get member statistics (Admin only)
const getMemberStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byYear: {
            $push: {
              year: '$year',
              count: 1
            }
          },
          byDepartment: {
            $push: {
              department: '$department',
              count: 1
            }
          },
          byRole: {
            $push: {
              role: '$role',
              count: 1
            }
          }
        }
      }
    ]);

    // Get recent joiners (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentJoiners = await User.countDocuments({
      joinedAt: { $gte: thirtyDaysAgo },
      isActive: true
    });

    // Process the aggregated data
    const result = stats[0] || { total: 0, byYear: [], byDepartment: [], byRole: [] };
    
    res.status(200).json({
      success: true,
      message: 'Member statistics retrieved successfully',
      data: {
        total: result.total,
        recentJoiners,
        byYear: result.byYear,
        byDepartment: result.byDepartment,
        byRole: result.byRole
      }
    });
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving member statistics',
      error: 'GET_MEMBER_STATS_ERROR'
    });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  deleteMember,
  getMemberStats
};