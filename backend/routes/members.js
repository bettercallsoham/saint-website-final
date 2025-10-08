const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     description: Retrieve a list of all members with filtering and pagination options
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, admin, faculty]
 *         description: Filter by member role
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *           enum: [1st, 2nd, 3rd, 4th, Graduate, Alumni]
 *         description: Filter by academic year
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [Computer Science, Information Technology, Electronics, Mechanical, Civil, Other]
 *         description: Filter by department
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of members per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in member name and email
 *     responses:
 *       200:
 *         description: Members retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 25
 *                 total:
 *                   type: integer
 *                   example: 150
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 15
 *                 members:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
// @desc    Get all members (public basic info)
// @route   GET /api/members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      role,
      year,
      department,
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (role) query.role = role;
    if (year) query.year = year;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const members = await User.find(query)
      .select('name email role year department studentId profileImage bio skills createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: members.length,
      total,
      currentPage: parseInt(page),
      totalPages,
      members
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all members (admin view with full details)
// @route   GET /api/members/admin/all
// @access  Private (Admin)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      role,
      year,
      department,
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    let query = {};

    if (role) query.role = role;
    if (year) query.year = year;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const members = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: members.length,
      total,
      currentPage: parseInt(page),
      totalPages,
      members
    });
  } catch (error) {
    console.error('Get admin members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private (Admin)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');

    if (!member || !member.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.json({
      success: true,
      member
    });
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['student', 'admin', 'faculty']).withMessage('Invalid role'),
  body('year').optional().isIn(['1st', '2nd', '3rd', '4th', 'Graduate', 'Alumni']).withMessage('Invalid year'),
  body('department').optional().isIn(['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Other']).withMessage('Invalid department'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const member = await User.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const updatedMember = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Member updated successfully',
      member: updatedMember
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get member statistics
// @route   GET /api/members/stats/overview
// @access  Private (Admin)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const total = await User.countDocuments({ isActive: true });
    const students = await User.countDocuments({ isActive: true, role: 'student' });
    const admins = await User.countDocuments({ isActive: true, role: 'admin' });
    const faculty = await User.countDocuments({ isActive: true, role: 'faculty' });

    const yearStats = await User.aggregate([
      { $match: { isActive: true, role: 'student' } },
      { $group: { _id: '$year', count: { $sum: 1 } } }
    ]);

    const departmentStats = await User.aggregate([
      { $match: { isActive: true, role: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    const recentMembers = await User.find({ isActive: true })
      .select('name email role year department createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const newThisMonth = await User.countDocuments({
      isActive: true,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    res.json({
      success: true,
      stats: {
        total,
        students,
        admins,
        faculty,
        newThisMonth,
        yearDistribution: yearStats,
        departmentDistribution: departmentStats,
        recent: recentMembers
      }
    });
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
