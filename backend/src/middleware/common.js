/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Default error
  let error = {
    success: false,
    message: 'Internal server error',
    error: 'INTERNAL_ERROR'
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    
    error = {
      success: false,
      message: 'Validation error',
      error: 'VALIDATION_ERROR',
      details: errors
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      success: false,
      message: `${field} already exists`,
      error: 'DUPLICATE_ERROR',
      field: field
    };
    return res.status(400).json(error);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error = {
      success: false,
      message: 'Invalid ID format',
      error: 'INVALID_ID'
    };
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    };
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      message: 'Token expired',
      error: 'TOKEN_EXPIRED'
    };
    return res.status(401).json(error);
  }

  // Development vs production error response
  if (process.env.NODE_ENV === 'development') {
    error.details = {
      message: err.message,
      stack: err.stack
    };
  }

  res.status(err.statusCode || 500).json(error);
};

/**
 * 404 handler
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'NOT_FOUND',
    requestedUrl: req.originalUrl,
    method: req.method
  });
};

module.exports = {
  errorHandler,
  notFound
};
