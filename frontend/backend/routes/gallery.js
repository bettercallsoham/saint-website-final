const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Gallery = require('../models/Gallery');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all gallery items
 *     description: Retrieve a list of all gallery items with filtering and pagination options
 *     tags: [Gallery]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [event, workshop, hackathon, meeting, social, achievement, other]
 *         description: Filter by gallery category
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
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
 *         description: Number of gallery items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in gallery title and description
 *     responses:
 *       200:
 *         description: Gallery items retrieved successfully
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
 *                 gallery:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GalleryItem'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gallery');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      isFeatured,
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) query.category = category;
    if (isFeatured === 'true') query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const galleryItems = await Gallery.find(query)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email studentId')
      .populate('event', 'title date')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Gallery.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      count: galleryItems.length,
      total,
      currentPage: parseInt(page),
      totalPages,
      gallery: galleryItems
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email studentId year department')
      .populate('event', 'title date location')
      .populate('likes', 'name email');

    if (!galleryItem || !galleryItem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Increment view count
    galleryItem.views += 1;
    await galleryItem.save();

    res.json({
      success: true,
      gallery: galleryItem
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private (Admin/Faculty)
router.post('/', protect, authorize('admin', 'faculty'), upload.array('images', 10), [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('category').isIn(['Hackathon', 'Workshop', 'Networking', 'Training', 'Awards', 'Conference', 'Social', 'Other']).withMessage('Invalid category'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('highlights').optional().isArray().withMessage('Highlights must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
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

    const { title, description, category, date, highlights, tags, event } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/gallery/${file.filename}`,
      alt: file.originalname,
      isPrimary: false
    })) : [];

    // Set first image as primary if exists
    if (images.length > 0) {
      images[0].isPrimary = true;
    }

    const galleryData = {
      title,
      description,
      category,
      date,
      images,
      highlights: highlights || [],
      tags: tags || [],
      event: event || null,
      createdBy: req.user.id
    };

    const galleryItem = await Gallery.create(galleryData);

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      gallery: galleryItem
    });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private (Admin/Faculty)
router.put('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      gallery: updatedGallery
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin/Faculty)
router.delete('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await Gallery.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Like gallery item
// @route   POST /api/gallery/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem || !galleryItem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Check if user already liked
    if (galleryItem.likes.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already liked this item'
      });
    }

    galleryItem.likes.push(req.user.id);
    await galleryItem.save();

    res.json({
      success: true,
      message: 'Gallery item liked successfully',
      likeCount: galleryItem.likes.length
    });
  } catch (error) {
    console.error('Like gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Unlike gallery item
// @route   DELETE /api/gallery/:id/like
// @access  Private
router.delete('/:id/like', protect, async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem || !galleryItem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    galleryItem.likes = galleryItem.likes.filter(
      userId => userId.toString() !== req.user.id.toString()
    );
    await galleryItem.save();

    res.json({
      success: true,
      message: 'Gallery item unliked successfully',
      likeCount: galleryItem.likes.length
    });
  } catch (error) {
    console.error('Unlike gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private (Admin/Faculty)
router.post('/', protect, authorize('admin', 'faculty'), upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, category, tags, isFeatured } = req.body;
    
    const imageUrls = req.files ? req.files.map(file => `/uploads/gallery/${file.filename}`) : [];

    const galleryItem = new Gallery({
      title,
      description,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      images: imageUrls,
      isFeatured: isFeatured === 'true',
      uploadedBy: req.user.id
    });

    await galleryItem.save();
    await galleryItem.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating gallery item'
    });
  }
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private (Admin/Faculty)
router.put('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating gallery item'
    });
  }
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (Admin/Faculty)
router.delete('/:id', protect, authorize('admin', 'faculty'), async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting gallery item'
    });
  }
});

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats/overview
// @access  Private (Admin)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const total = await Gallery.countDocuments({ isActive: true });
    const featured = await Gallery.countDocuments({ isActive: true, isFeatured: true });
    const totalLikes = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalLikes: { $sum: '$likeCount' } } }
    ]);
    const totalViews = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const categoryStats = await Gallery.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const recentItems = await Gallery.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category date likeCount views createdAt');

    res.json({
      success: true,
      stats: {
        total,
        featured,
        totalLikes: totalLikes[0]?.totalLikes || 0,
        totalViews: totalViews[0]?.totalViews || 0,
        category: categoryStats,
        recent: recentItems
      }
    });
  } catch (error) {
    console.error('Get gallery stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
