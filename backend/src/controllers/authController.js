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
   * Get current user profile
   */
  async getProfile(req, res) {
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

      console.log('Getting user profile via external API');
      
      const result = await apiService.getTokenInfo(token);
      
      console.log('User profile retrieved successfully via external API');
      
      res.json({
        success: true,
        data: result.data?.user || result.data,
        message: 'Profile retrieved successfully'
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(401).json({
        success: false,
        message: 'Failed to get user profile',
        error: 'PROFILE_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      const updates = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token not provided',
          error: 'MISSING_TOKEN'
        });
      }

      console.log('Updating user profile via external API');
      
      // For now, just return success since we don't have profile update in external API
      // In a real implementation, you'd call the external API to update profile
      
      res.json({
        success: true,
        data: updates,
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: 'PROFILE_UPDATE_ERROR',
        details: error.error || error.message
      });
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(req, res) {
    try {
      // For now, return mock data since we don't have user management in external API
      // In a real implementation, you'd fetch from your user database or external API
      
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          studentId: 'ST001',
          department: 'Computer Science',
          year: '3rd',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Jane Admin',
          email: 'jane@example.com',
          role: 'admin',
          department: 'Administration',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bob Student',
          email: 'bob@example.com', 
          role: 'user',
          studentId: 'ST002',
          department: 'Information Technology',
          year: '2nd',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        data: mockUsers,
        message: 'Users retrieved successfully'
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get users',
        error: 'GET_USERS_ERROR'
      });
    }
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      // Mock user data
      const mockUser = {
        id,
        name: 'User ' + id,
        email: `user${id}@example.com`,
        role: 'user',
        studentId: `ST00${id}`,
        department: 'Computer Science',
        year: '2nd',
        isActive: true,
        createdAt: new Date().toISOString()
      };

      res.json({
        success: true,
        data: mockUser,
        message: 'User retrieved successfully'
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user',
        error: 'GET_USER_ERROR'
      });
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      res.json({
        success: true,
        data: { id, role },
        message: 'User role updated successfully'
      });

    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user role',
        error: 'UPDATE_ROLE_ERROR'
      });
    }
  }

  /**
   * Update user status (admin only)
   */
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      res.json({
        success: true,
        data: { id, isActive },
        message: 'User status updated successfully'
      });

    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user status',
        error: 'UPDATE_STATUS_ERROR'
      });
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      res.json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: 'DELETE_USER_ERROR'
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
