const express = require('express');
const { body, validationResult } = require('express-validator');
const Testimonial = require('../models/Testimonial');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     summary: Get all testimonials
 *     description: Retrieve a list of all testimonials with filtering and pagination options
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: isApproved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status
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
 *         description: Number of testimonials per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in testimonial name, role, and content
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
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
 *                 testimonials:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      isFeatured,
      isApproved,
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (isFeatured === 'true') query.isFeatured = true;
    if (isApproved === 'true') query.isApproved = true;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const testimonials = await Testimonial.find(query)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Testimonial.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: testimonials.length,
      total,
      currentPage: parseInt(page),
      totalPages,
      testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('approvedBy', 'name email');

    if (!testimonial || !testimonial.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      testimonial
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit testimonial
// @route   POST /api/testimonials
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('role').trim().isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company cannot be more than 100 characters'),
  body('content').trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('graduationYear').optional().trim().isLength({ max: 10 }).withMessage('Graduation year cannot be more than 10 characters'),
  body('currentPosition').optional().trim().isLength({ max: 100 }).withMessage('Current position cannot be more than 100 characters'),
  body('achievements').optional().isArray().withMessage('Achievements must be an array'),
  body('socialLinks.linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.github').optional().isURL().withMessage('GitHub must be a valid URL'),
  body('socialLinks.twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
  body('socialLinks.website').optional().isURL().withMessage('Website must be a valid URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      role,
      company,
      content,
      rating,
      email,
      graduationYear,
      currentPosition,
      achievements,
      socialLinks
    } = req.body;

    const testimonial = await Testimonial.create({
      name,
      role,
      company,
      content,
      rating,
      email,
      graduationYear,
      currentPosition,
      achievements: achievements || [],
      socialLinks: socialLinks || {},
      isApproved: false, // Requires admin approval
      isFeatured: false
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed before being published.',
      testimonial: {
        id: testimonial._id,
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        rating: testimonial.rating,
        isApproved: testimonial.isApproved,
        createdAt: testimonial.createdAt
      }
    });
  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during testimonial submission'
    });
  }
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('role').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Role must be between 2 and 100 characters'),
  body('company').optional().trim().isLength({ max: 100 }).withMessage('Company cannot be more than 100 characters'),
  body('content').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Content must be between 10 and 1000 characters'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
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

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await Testimonial.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Approve testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private (Admin)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    testimonial.isApproved = true;
    testimonial.approvedBy = req.user.id;
    testimonial.approvedAt = new Date();
    await testimonial.save();

    res.json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial
    });
  } catch (error) {
    console.error('Approve testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Feature testimonial
// @route   PUT /api/testimonials/:id/feature
// @access  Private (Admin)
router.put('/:id/feature', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    if (!testimonial.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Testimonial must be approved before featuring'
      });
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.json({
      success: true,
      message: `Testimonial ${testimonial.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      testimonial
    });
  } catch (error) {
    console.error('Feature testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating testimonial'
    });
  }
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting testimonial'
    });
  }
});

// @desc    Get testimonial statistics
// @route   GET /api/testimonials/stats/overview
// @access  Private (Admin)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const total = await Testimonial.countDocuments({ isActive: true });
    const approved = await Testimonial.countDocuments({ isActive: true, isApproved: true });
    const pending = await Testimonial.countDocuments({ isActive: true, isApproved: false });
    const featured = await Testimonial.countDocuments({ isActive: true, isFeatured: true });

    const ratingStats = await Testimonial.aggregate([
      { $match: { isActive: true, isApproved: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const recentTestimonials = await Testimonial.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name role company rating isApproved isFeatured createdAt');

    const averageRating = await Testimonial.aggregate([
      { $match: { isActive: true, isApproved: true } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        approved,
        pending,
        featured,
        averageRating: averageRating[0]?.averageRating || 0,
        ratingDistribution: ratingStats,
        recent: recentTestimonials
      }
    });
  } catch (error) {
    console.error('Get testimonial stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
