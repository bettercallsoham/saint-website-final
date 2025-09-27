/**
 * CORS Configuration for SAINT Backend API
 * Handles Cross-Origin Resource Sharing for multiple frontend environments
 */

const corsConfig = {
  // Dynamic origin configuration
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variables
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [
          'http://localhost:3000',  // Default React dev server
          'http://localhost:8080',  // Vite dev server
          'http://localhost:5173',  // Alternative Vite port
          'http://127.0.0.1:3000',
          'http://127.0.0.1:8080',
          'http://127.0.0.1:5173',
        ];

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origin ${origin} not allowed by CORS policy`);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  },

  // Enable credentials (cookies, authorization headers, TLS client certificates)
  credentials: true,

  // Allowed HTTP methods
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE', 
    'PATCH',
    'OPTIONS',
    'HEAD'
  ],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],

  // Headers exposed to the client
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'Link'
  ],

  // Preflight cache duration (in seconds)
  maxAge: 86400, // 24 hours

  // Handle preflight OPTIONS requests
  preflightContinue: false,
  optionsSuccessStatus: 204
};

/**
 * Development-specific CORS configuration
 * More permissive for local development
 */
const developmentCorsConfig = {
  ...corsConfig,
  origin: true, // Allow all origins in development
  credentials: true
};

/**
 * Production CORS configuration
 * More restrictive for production environments
 */
const productionCorsConfig = {
  ...corsConfig,
  // In production, be more strict about origins
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [];

    // In production, don't allow requests with no origin
    if (!origin) {
      return callback(new Error('Origin not allowed by CORS policy'));
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS policy`));
    }
  }
};

/**
 * Get CORS configuration based on environment
 */
function getCorsConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.log('🔧 Using development CORS configuration (permissive)');
    return developmentCorsConfig;
  } else {
    console.log('🔒 Using production CORS configuration (restrictive)');
    return productionCorsConfig;
  }
}

module.exports = {
  corsConfig,
  developmentCorsConfig,
  productionCorsConfig,
  getCorsConfig
};
