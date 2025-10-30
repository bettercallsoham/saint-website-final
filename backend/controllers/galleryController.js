const Gallery = require('../models/Gallery');
const { validateGalleryItem } = require('../utils/validation');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;

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
    console.log('Received gallery data:', req.body);
    console.log('Received file:', req.file);
    
    let imageUrl = req.body.imageUrl;
    
    // If a file was uploaded, upload to Cloudinary
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'saint-website/gallery',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        
        imageUrl = result.secure_url;
        
        // Delete local file after uploading to Cloudinary
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting local file:', unlinkError);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // If Cloudinary upload fails, fall back to local storage
        imageUrl = `/uploads/gallery/${req.file.filename}`;
      }
    }
    
    // Ensure we have either uploaded file or URL
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Either upload an image file or provide an image URL',
        error: 'IMAGE_REQUIRED'
      });
    }
    
    // Prepare validation data (without uploadedBy for validation)
    const validationData = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: imageUrl,
      category: req.body.category || 'event',
      eventName: req.body.eventName || '',
      photographer: req.body.photographer || '',
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true
    };
    
    // Validate the data (skip imageUrl validation if file was uploaded)
    const { error } = validateGalleryItem(validationData, !!req.file);
    if (error) {
      console.log('Gallery validation error:', error.details[0]);
      console.log('Item data being validated:', validationData);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    // Prepare final gallery item data with uploadedBy
    const itemData = {
      ...validationData,
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

// Create new gallery item with multiple images (Admin only)
const createGalleryItemMultiple = async (req, res) => {
  try {
    console.log('Received gallery data:', req.body);
    console.log('Received files:', req.files);
    
    let images = [];
    let imageUrl = req.body.imageUrl;
    
    // If files were uploaded, process them
    if (req.files && req.files.length > 0) {
      const primaryIndex = parseInt(req.body.primaryImageIndex) || 0;
      
      // Upload all files to Cloudinary
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'saint-website/gallery',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          });
          
          images.push({
            url: result.secure_url,
            caption: req.body[`caption_${i}`] || '',
            isPrimary: i === primaryIndex,
            metadata: {
              originalName: file.originalname,
              size: file.size,
              format: file.mimetype,
              cloudinaryId: result.public_id
            }
          });
          
          // Delete local file after uploading
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error('Error deleting local file:', unlinkError);
          }
        } catch (uploadError) {
          console.error(`Cloudinary upload error for file ${i}:`, uploadError);
          // Fall back to local storage for this file
          images.push({
            url: `/uploads/gallery/${file.filename}`,
            caption: req.body[`caption_${i}`] || '',
            isPrimary: i === primaryIndex,
            metadata: {
              originalName: file.originalname,
              size: file.size,
              format: file.mimetype
            }
          });
        }
      }
      
      // Set primary image as main imageUrl
      imageUrl = images[primaryIndex]?.url || images[0].url;
    }
    
    // Ensure we have either uploaded files or URL
    if (!imageUrl && images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Either upload image files or provide an image URL',
        error: 'IMAGE_REQUIRED'
      });
    }
    
    // Prepare validation data
    const validationData = {
      title: req.body.title,
      description: req.body.description,
      imageUrl: imageUrl || '',
      category: req.body.category || 'event',
      eventName: req.body.eventName || '',
      photographer: req.body.photographer || '',
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true
    };
    
    // Prepare final gallery item data with uploadedBy
    const itemData = {
      ...validationData,
      images: images,
      uploadedBy: req.user._id
    };
    
    const item = new Gallery(itemData);
    await item.save();
    
    const populatedItem = await Gallery.findById(item._id)
      .populate('uploadedBy', 'name email')
      .populate('event', 'title date');
    
    res.status(201).json({
      success: true,
      message: 'Gallery item with multiple images created successfully',
      data: { item: populatedItem }
    });
  } catch (error) {
    console.error('Create gallery item with multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating gallery item with multiple images',
      error: 'CREATE_GALLERY_ITEM_MULTIPLE_ERROR'
    });
  }
};

// Update gallery item (Admin only)
const updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prepare update data
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      eventName: req.body.eventName,
      photographer: req.body.photographer,
      isFeatured: req.body.isFeatured === 'true' || req.body.isFeatured === true
    };
    
    // Handle image update
    if (req.file) {
      try {
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'saint-website/gallery',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
        
        updateData.imageUrl = result.secure_url;
        
        // Delete local file
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting local file:', unlinkError);
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Fall back to local storage
        updateData.imageUrl = `/uploads/gallery/${req.file.filename}`;
      }
    } else if (req.body.imageUrl) {
      // If URL provided, use it
      updateData.imageUrl = req.body.imageUrl;
    }
    // If neither provided, keep existing image
    
    const item = await Gallery.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
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
  createGalleryItemMultiple,
  updateGalleryItem,
  deleteGalleryItem,
  toggleLike,
  getFeaturedGallery
};