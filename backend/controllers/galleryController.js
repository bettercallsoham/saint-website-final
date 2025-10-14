const Gallery = require('../models/Gallery');
const { validateGalleryItem } = require('../utils/validation');

// Get all gallery items
const getAllGallery = async (req, res) => {
  try {
    const { category, featured, limit, page, eventId } = req.query;
    
    let query = { isActive: true };
    
    // Add filters
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (eventId) query.event = eventId;
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;
    
    const gallery = await Gallery.find(query)
      .populate('uploadedBy', 'name email')
      .populate('event', 'title date')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Gallery.countDocuments(query);
    
    res.status(200).json({
      success: true,
      message: 'Gallery items retrieved successfully',
      data: {
        gallery,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving gallery items',
      error: 'GET_GALLERY_ERROR'
    });
  }
};

// Get single gallery item by ID
const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Gallery.findOne({ _id: id, isActive: true })
      .populate('uploadedBy', 'name email')
      .populate('event', 'title date venue');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: 'GALLERY_ITEM_NOT_FOUND'
      });
    }
    
    // Increment views
    await item.incrementViews();
    
    res.status(200).json({
      success: true,
      message: 'Gallery item retrieved successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving gallery item',
      error: 'GET_GALLERY_ITEM_ERROR'
    });
  }
};

// Create new gallery item (Admin only)
const createGalleryItem = async (req, res) => {
  try {
    // Validate input data
    const { error } = validateGalleryItem(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    const itemData = {
      ...req.body,
      uploadedBy: req.user._id
    };
    
    const item = new Gallery(itemData);
    await item.save();
    
    const populatedItem = await Gallery.findById(item._id)
      .populate('uploadedBy', 'name email')
      .populate('event', 'title date');
    
    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: { item: populatedItem }
    });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gallery item',
      error: 'CREATE_GALLERY_ITEM_ERROR'
    });
  }
};

// Update gallery item (Admin only)
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Gallery.findOneAndUpdate(
      { _id: id, isActive: true },
      req.body,
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email')
     .populate('event', 'title date');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: 'GALLERY_ITEM_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: { item }
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery item',
      error: 'UPDATE_GALLERY_ITEM_ERROR'
    });
  }
};

// Delete gallery item (Admin only)
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Gallery.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: 'GALLERY_ITEM_NOT_FOUND'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery item',
      error: 'DELETE_GALLERY_ITEM_ERROR'
    });
  }
};

// Like/Unlike gallery item (Authenticated users)
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const item = await Gallery.findOne({ _id: id, isActive: true });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
        error: 'GALLERY_ITEM_NOT_FOUND'
      });
    }
    
    await item.toggleLike(userId);
    
    const updatedItem = await Gallery.findById(id)
      .populate('uploadedBy', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Like toggled successfully',
      data: { 
        item: updatedItem,
        isLiked: updatedItem.isLikedBy(userId)
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: 'TOGGLE_LIKE_ERROR'
    });
  }
};

// Get featured gallery items
const getFeaturedGallery = async (req, res) => {
  try {
    const featured = await Gallery.findFeatured().limit(6);
    
    res.status(200).json({
      success: true,
      message: 'Featured gallery items retrieved successfully',
      data: { gallery: featured }
    });
  } catch (error) {
    console.error('Get featured gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving featured gallery items',
      error: 'GET_FEATURED_GALLERY_ERROR'
    });
  }
};

module.exports = {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleLike,
  getFeaturedGallery
};