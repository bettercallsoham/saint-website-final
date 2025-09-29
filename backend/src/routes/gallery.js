const express = require('express');
const galleryController = require('../controllers/galleryController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validateMongoId } = require('../middleware/validation');
const { generalLimiter } = require('../middleware/common');

const router = express.Router();

// Apply rate limiting to all gallery routes
router.use(generalLimiter);

/**
 * @route   GET /api/gallery
 * @desc    Get all gallery items
 * @access  Public
 */
router.get('/', galleryController.getAllGalleryItems);

/**
 * @route   GET /api/gallery/:id
 * @desc    Get gallery item by ID
 * @access  Public
 */
router.get('/:id', validateMongoId, galleryController.getGalleryItemById);

/**
 * @route   POST /api/gallery
 * @desc    Create a new gallery item
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, galleryController.createGalleryItem);

module.exports = router;
