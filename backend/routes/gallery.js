const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin, optionalAuth } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleLike,
  getFeaturedGallery
} = require('../controllers/galleryController');

// Public routes
router.get('/', getAllGallery);
router.get('/featured', getFeaturedGallery);
router.get('/:id', optionalAuth, getGalleryById); // Optional auth to track views

// Protected routes (authenticated users)
router.post('/:id/like', authenticate, toggleLike);

// Admin only routes
router.post('/', authenticate, requireAdmin, uploadSingle, handleUploadError, createGalleryItem);
router.put('/:id', authenticate, requireAdmin, uploadSingle, handleUploadError, updateGalleryItem);
router.delete('/:id', authenticate, requireAdmin, deleteGalleryItem);

module.exports = router;