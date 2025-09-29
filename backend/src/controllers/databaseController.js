const apiService = require('../utils/apiService');


class DatabaseController {
  /**
   * Get database connection status
   */
  async getStatus(req, res) {
    try {
      console.log('Fetching database status via external API');
      
      const result = await apiService.getDatabaseStatus();
      
      console.log('Database status fetched successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Get database status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get database status',
        error: 'DATABASE_STATUS_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Connect to database
   */
  async connect(req, res) {
    try {
      console.log('Connecting to database via external API');
      
      const result = await apiService.connectDatabase();
      
      console.log('Database connection initiated successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Database connect error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to connect to database',
        error: 'DATABASE_CONNECT_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Disconnect from database
   */
  async disconnect(req, res) {
    try {
      console.log('Disconnecting from database via external API');
      
      const result = await apiService.disconnectDatabase();
      
      console.log('Database disconnection initiated successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Database disconnect error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to disconnect from database',
        error: 'DATABASE_DISCONNECT_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Test database operations
   */
  async test(req, res) {
    try {
      console.log('Testing database operations via external API');
      
      const result = await apiService.testDatabase();
      
      console.log('Database test completed successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Database test error:', error);
      res.status(500).json({
        success: false,
        message: 'Database test failed',
        error: 'DATABASE_TEST_ERROR',
        details: error.error || error.message
      });
    }
  }
}

module.exports = new DatabaseController();
