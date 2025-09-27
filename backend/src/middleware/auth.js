const jwtManager = require('../utils/jwt');

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtManager.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'MISSING_TOKEN'
      });
    }

    const decoded = jwtManager.verifyAccessToken(token);
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    };

    // Add token to request for potential use
    req.token = token;

    console.log('User authenticated', { userId: decoded.userId, email: decoded.email });
    next();

  } catch (error) {
    console.log('Authentication failed:', error.message);
    
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'INVALID_TOKEN',
      details: error.message
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 */
const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtManager.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = jwtManager.verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
      };
      req.token = token;
      console.log('Optional auth - User authenticated', { userId: decoded.userId });
    } else {
      req.user = null;
      console.log('Optional auth - No token provided');
    }

    next();

  } catch (error) {
    // For optional auth, we don't fail - just set user to null
    req.user = null;
    console.log('Optional auth - Token invalid:', error.message);
    next();
  }
};

/**
 * Admin role authorization middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      error: 'NOT_AUTHENTICATED'
    });
  }

  if (req.user.role !== 'admin') {
    console.warn('Admin access attempted by non-admin user', { 
      userId: req.user.userId, 
      role: req.user.role 
    });
    
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required',
      error: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  console.log('Admin access granted', { userId: req.user.userId });
  next();
};

/**
 * Role-based authorization middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      console.warn('Role-based access denied', { 
        userId: req.user.userId, 
        userRole, 
        requiredRoles: allowedRoles 
      });
      
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    console.log('Role-based access granted', { userId: req.user.userId, role: userRole });
    next();
  };
};

/**
 * Middleware to validate admin secret key
 */
const validateAdminSecret = (req, res, next) => {
  const { adminSecret } = req.body;
  const validSecret = process.env.ADMIN_SECRET_KEY;

  if (!adminSecret) {
    return res.status(400).json({
      success: false,
      message: 'Admin secret key required',
      error: 'MISSING_ADMIN_SECRET'
    });
  }

  if (adminSecret !== validSecret) {
    console.warn('Invalid admin secret key attempt', { 
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    return res.status(403).json({
      success: false,
      message: 'Invalid admin secret key',
      error: 'INVALID_ADMIN_SECRET'
    });
  }

  console.log('Valid admin secret key provided');
  next();
};

module.exports = {
  authenticate,
  optionalAuthenticate,
  requireAdmin,
  requireRole,
  validateAdminSecret
};
