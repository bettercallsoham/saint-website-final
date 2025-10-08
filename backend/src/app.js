const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { getCorsConfig } = require('./config/corsConfig');

// Import routes
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const membersRoutes = require('./routes/members');
const contactRoutes = require('./routes/contact');
const galleryRoutes = require('./routes/gallery');
const databaseRoutes = require('./routes/database');
const rsvpRoutes = require('./routes/rsvps');

const app = express();

// Basic middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// CORS configuration - supports multiple origins and credentials
const corsOptions = getCorsConfig();
app.use(cors(corsOptions));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'SAINT Backend API',
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
    res.json({
        message: 'CORS is working!',
        origin: req.get('Origin'),
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/rsvps', rsvpRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        statusCode: 404
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`, err.stack);

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.statusCode || 500).json({
        error: err.message || 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack }),
        statusCode: err.statusCode || 500
    });
});

module.exports = app;
