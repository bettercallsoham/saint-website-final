const apiService = require('../utils/apiService');


class MembersController {
  /**
   * Get all members
   */
  async getAllMembers(req, res) {
    try {
      console.log('Fetching all members via external API');
      
      const result = await apiService.getAllMembers();
      
      console.log('Members fetched successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Get members error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch members',
        error: 'FETCH_MEMBERS_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Get member by ID
   */
  async getMemberById(req, res) {
    try {
      const { id } = req.params;
      
      console.log('Fetching member by ID via external API', { memberId: id });
      
      const result = await apiService.getMemberById(id);
      
      console.log('Member fetched successfully via external API', { memberId: id });
      
      res.json(result.data);

    } catch (error) {
      console.error('Get member by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch member',
        error: 'FETCH_MEMBER_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Create a new member (admin only)
   */
  async createMember(req, res) {
    try {
      const memberData = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      
      console.log('Creating member via external API', { name: `${memberData.firstName} ${memberData.lastName}` });
      
      const result = await apiService.createMember(memberData, token);
      
      console.log('Member created successfully via external API', { name: `${memberData.firstName} ${memberData.lastName}` });
      
      res.status(201).json(result.data);

    } catch (error) {
      console.error('Create member error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create member',
        error: 'CREATE_MEMBER_ERROR',
        details: error.error || error.message
      });
    }
  }
}

module.exports = new MembersController();
