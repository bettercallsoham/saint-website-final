const apiService = require('../utils/apiService');

class AuthController {
  /**
   * Register a new user
   */
  async register(req, res) {
    try {
      const userData = req.body;
      
      console.log('Registering user via external API', userData.email);
      
      const result = await apiService.register(userData);
      
      console.log('User registered successfully via external API', userData.email);
      
      res.status(201).json(result.data);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: 'REGISTRATION_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Register an admin user
   */
  async adminRegister(req, res) {
    try {
      const adminData = req.body;
      // adminSecret is already validated by middleware
      
      console.log('Registering admin via external API', adminData.email);
      
      const result = await apiService.register({
        ...adminData,
        role: 'admin'
      });
      
      console.log('Admin registered successfully via external API', adminData.email);
      
      res.status(201).json(result.data);

    } catch (error) {
      console.error('Admin registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Admin registration failed',
        error: 'ADMIN_REGISTRATION_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * User login
   */
  async login(req, res) {
    try {
      const credentials = req.body;
      
      console.log('User login attempt via external API', credentials.email);
      
      const result = await apiService.login(credentials);
      
      console.log('User logged in successfully via external API', credentials.email);
      
      res.json(result.data);

    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: 'Login failed',
        error: 'LOGIN_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      console.log('Refreshing token via external API');
      
      const result = await apiService.refreshToken(refreshToken);
      
      console.log('Token refreshed successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: 'Token refresh failed',
        error: 'TOKEN_REFRESH_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Validate token
   */
  async validateToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token not provided',
          error: 'MISSING_TOKEN'
        });
      }

      console.log('Validating token via external API');
      
      const result = await apiService.validateToken(token);
      
      console.log('Token validated successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({
        success: false,
        message: 'Token validation failed',
        error: 'INVALID_TOKEN',
        details: error.error || error.message
      });
    }
  }

  /**
   * Get token information
   */
  async getTokenInfo(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token not provided',
          error: 'MISSING_TOKEN'
        });
      }

      console.log('Getting token info via external API');
      
      const result = await apiService.getTokenInfo(token);
      
      console.log('Token info retrieved successfully via external API');
      
      res.json(result.data);

    } catch (error) {
      console.error('Get token info error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get token information',
        error: 'TOKEN_INFO_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Logout (invalidate refresh token)
   */
  async logout(req, res) {
    try {
      console.log('User logged out', req.user?.userId);

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: 'LOGOUT_ERROR'
      });
    }
  }
}

module.exports = new AuthController();
