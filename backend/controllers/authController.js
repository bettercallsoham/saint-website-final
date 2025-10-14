const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validateUserRegistration, validateAdminRegistration, validateLogin } = require('../utils/validation');

// User Registration
const registerUser = async (req, res) => {
  try {
    // Validate input data
    const { error } = validateUserRegistration(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { name, email, password, phoneNumber, studentId, department, year } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address',
        error: 'USER_EXISTS'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      studentId,
      department,
      year,
      role: 'user'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: 'REGISTRATION_ERROR'
    });
  }
};

// Admin Registration
const registerAdmin = async (req, res) => {
  try {
    // Validate input data
    const { error } = validateAdminRegistration(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { name, email, password, adminCode } = req.body;

    // Verify admin code (you can change this to your preferred admin code)
    const ADMIN_CODE = process.env.ADMIN_CODE || 'saint-admin-2024';
    if (adminCode !== ADMIN_CODE) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin code',
        error: 'INVALID_ADMIN_CODE'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email address',
        error: 'USER_EXISTS'
      });
    }

    // Create new admin user
    const admin = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    await admin.save();

    // Generate token
    const token = generateToken(admin._id, admin.role);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        user: admin.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering admin',
      error: 'ADMIN_REGISTRATION_ERROR'
    });
  }
};

// User/Admin Login
const login = async (req, res) => {
  try {
    // Validate input data
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toPublicJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: 'LOGIN_ERROR'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving profile',
      error: 'PROFILE_ERROR'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const allowedFields = ['name', 'phoneNumber', 'studentId', 'department', 'year'];
    const updateData = {};

    // Only allow specific fields to be updated
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: 'PROFILE_UPDATE_ERROR'
    });
  }
};

// Logout (client-side token removal, server logs the action)
const logout = async (req, res) => {
  try {
    // In a more complex setup, you might maintain a blacklist of tokens
    // For now, we'll just send a success response as the client will remove the token
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout',
      error: 'LOGOUT_ERROR'
    });
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  login,
  getProfile,
  updateProfile,
  logout
};