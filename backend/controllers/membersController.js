const User = require('../models/User');
const Member = require('../models/Member');

// Get all members (regular users only, not core team)
const getAllMembers = async (req, res) => {
  try {
    const { year, designation, limit, page } = req.query;
    
    // Get regular user members and exclude admin users
    let userQuery = { isActive: true, role: { $ne: 'admin' } };
    
    // Add filters for users
    if (year) userQuery.year = year;
    if (designation) userQuery.department = designation;
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;
    
    const users = await User.find(userQuery)
      .select('name email phoneNumber studentId department year joinedAt profilePicture role')
      .sort({ joinedAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await User.countDocuments(userQuery);
    
    // Format users to match expected structure
    const members = users.map(user => ({
      id: user._id,
      _id: user._id,
      name: user.name,
      position: user.role || 'Member',
      designation: user.role || 'Member',
      year: user.year || 'Not specified',
      branch: user.department || 'Not specified',
      bio: user.department && user.year ? 
           `${user.name} is a ${user.year} student in ${user.department}` : 
           `${user.name} is a member of SAInT club`,
      profileImage: user.profilePicture,
      skills: ['Technology', 'Innovation'],
      email: user.email,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
      role: user.role || 'Member',
      studentId: user.studentId || 'Not provided'
    }));
    
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

// Get core team members
const getCoreTeamMembers = async (req, res) => {
  try {
    const { designation } = req.query;
    
    let query = { isActive: true, isCoreTeam: true };
    
    // Add designation filter
    if (designation) query.designation = designation;
    
    const coreTeam = await Member.find(query)
      .sort({ displayOrder: 1, name: 1 });
    
    res.status(200).json({
      success: true,
      message: 'Core team members retrieved successfully',
      data: {
        members: coreTeam.map(member => ({
          id: member._id,
          _id: member._id,
          name: member.name,
          position: member.designation,
          designation: member.designation,
          year: member.year,
          branch: member.branch,
          bio: member.bio,
          profileImage: member.profileImage,
          skills: member.skills,
          github: member.github,
          linkedin: member.linkedin,
          email: member.email,
          phoneNumber: member.phoneNumber,
          isActive: member.isActive,
          role: member.designation,
          studentId: `SAINT-${member.displayOrder.toString().padStart(3, '0')}`,
          displayOrder: member.displayOrder
        })),
        total: coreTeam.length
      }
    });
  } catch (error) {
    console.error('Get core team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving core team members',
      error: 'GET_CORE_TEAM_ERROR'
    });
  }
};



// Get member statistics (Admin only)
const getMemberStats = async (req, res) => {
  try {
    // Get user stats
    const userStats = await User.aggregate([
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

    // Get core team stats
    const coreTeamStats = await Member.aggregate([
      { $match: { isActive: true, isCoreTeam: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byDesignation: {
            $push: {
              designation: '$designation',
              count: 1
            }
          },
          byYear: {
            $push: {
              year: '$year',
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
    const userResult = userStats[0] || { total: 0, byYear: [], byDepartment: [], byRole: [] };
    const coreTeamResult = coreTeamStats[0] || { total: 0, byDesignation: [], byYear: [] };
    
    res.status(200).json({
      success: true,
      message: 'Member statistics retrieved successfully',
      data: {
        totalUsers: userResult.total,
        totalCoreTeam: coreTeamResult.total,
        totalMembers: userResult.total + coreTeamResult.total,
        recentJoiners,
        users: {
          byYear: userResult.byYear,
          byDepartment: userResult.byDepartment,
          byRole: userResult.byRole
        },
        coreTeam: {
          byDesignation: coreTeamResult.byDesignation,
          byYear: coreTeamResult.byYear
        }
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
  getMemberStats,
  getCoreTeamMembers
};