const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const userAuthRoutes = require('./routes/users');
const adminAuthRoutes = require('./routes/adminAuth');
const eventsRoutes = require('./routes/events');
const membersRoutes = require('./routes/members');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
  process.env.FRONTEND_URL, // Add your Vercel frontend URL here
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins - restrict in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static('uploads'));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Database connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('✅ Using cached database connection');
    return cachedDb;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
    
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds for cold starts
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    
    cachedDb = db;
    console.log('✅ Connected to MongoDB successfully');
    console.log('Database name:', mongoose.connection.db.databaseName);
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Error name:', error.name);
    console.error('Full error:', error);
    cachedDb = null; // Clear cache on error
    throw error;
  }
}

// Connect to database on startup (for local development)
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().catch(err => {
    console.error('Failed to connect on startup:', err);
  });
}

// Middleware to ensure database connection for each request (for Vercel)
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: 'DATABASE_CONNECTION_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Routes
app.use('/api/users', userAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (bypasses database connection)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      status: dbStates[dbStatus],
      readyState: dbStatus,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'NOT SET'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SAInT Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      members: '/api/members',
      coreTeam: '/api/members/core-team',
      events: '/api/events',
      gallery: '/api/gallery',
      contact: '/api/contact'
    },
    documentation: 'Visit /api/health for server status'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server (only for local development, not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  });
}

// Export for Vercel
module.exports = app;