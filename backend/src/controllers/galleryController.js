const apiService = require('../utils/apiService');


class GalleryController {
  /**
   * Get all gallery items
   */
  async getAllGalleryItems(req, res) {
    try {
      console.log('Fetching all gallery items via external API');
      
      const result = await apiService.getAllGalleryItems();
      
      console.log('Gallery items fetched successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Get gallery items error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery items',
        error: 'FETCH_GALLERY_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Get gallery item by ID
   */
  async getGalleryItemById(req, res) {
    try {
      const { id } = req.params;
      
      console.log('Fetching gallery item by ID via external API', { itemId: id });
      
      const result = await apiService.getGalleryItemById(id);
      
      console.log('Gallery item fetched successfully via external API', { itemId: id });
      
      res.json(result.data);

    } catch (error) {
      console.error('Get gallery item by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery item',
        error: 'FETCH_GALLERY_ITEM_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Create a new gallery item (admin only)
   */
  async createGalleryItem(req, res) {
    try {
      const itemData = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      
      console.log('Creating gallery item via external API', { title: itemData.title });
      
      const result = await apiService.createGalleryItem(itemData, token);
      
      console.log('Gallery item created successfully via external API', { title: itemData.title });
      
      res.status(201).json(result.data);

    } catch (error) {
      console.error('Create gallery item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create gallery item',
        error: 'CREATE_GALLERY_ITEM_ERROR',
        details: error.error || error.message
      });
    }
  }
}

module.exports = new GalleryController();
