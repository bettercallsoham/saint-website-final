const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DatabaseStatus:
 *       type: object
 *       properties:
 *         connected:
 *           type: boolean
 *           example: true
 *         connectionState:
 *           type: string
 *           enum: [disconnected, connected, connecting, disconnecting]
 *           example: connected
 *         host:
 *           type: string
 *           example: localhost
 *         port:
 *           type: number
 *           example: 27017
 *         name:
 *           type: string
 *           example: saint-website
 *         collections:
 *           type: array
 *           items:
 *             type: string
 *           example: [users, events, testimonials, galleries, contacts]
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 */

/**
 * @swagger
 * /api/database/status:
 *   get:
 *     summary: Get database connection status
 *     description: Check the current status of the database connection
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Database status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database status retrieved
 *                 data:
 *                   $ref: '#/components/schemas/DatabaseStatus'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve database status
 */
// @desc    Get database connection status
// @route   GET /api/database/status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const connection = mongoose.connection;
    const state = connection.readyState;
    
    const states = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };

    const status = {
      connected: state === 1,
      connectionState: states[state] || 'unknown',
      host: connection.host || 'unknown',
      port: connection.port || 'unknown',
      name: connection.name || 'unknown',
      timestamp: new Date().toISOString()
    };

    // Get collections if connected
    if (state === 1) {
      try {
        const collections = await connection.db.listCollections().toArray();
        status.collections = collections.map(col => col.name);
      } catch (error) {
        status.collections = [];
        status.collectionsError = error.message;
      }
    }

    res.json({
      success: true,
      message: 'Database status retrieved',
      data: status
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve database status',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/database/connect:
 *   post:
 *     summary: Connect to database
 *     description: Manually establish a connection to the database
 *     tags: [Database]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uri:
 *                 type: string
 *                 description: MongoDB connection URI (optional, uses environment variable if not provided)
 *                 example: mongodb://localhost:27017/saint-website
 *     responses:
 *       200:
 *         description: Database connection established successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database connected successfully
 *                 data:
 *                   $ref: '#/components/schemas/DatabaseStatus'
 *       400:
 *         description: Invalid connection parameters
 *       500:
 *         description: Connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to connect to database
 *                 error:
 *                   type: string
 *                   example: Connection timeout
 */
// @desc    Connect to database
// @route   POST /api/database/connect
// @access  Public
router.post('/connect', async (req, res) => {
  try {
    const { uri } = req.body;
    const mongoUri = uri || process.env.MONGODB_URI;

    if (!mongoUri) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB URI is required',
        error: 'No MongoDB URI provided in request body or environment variables'
      });
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return res.json({
        success: true,
        message: 'Database already connected',
        data: {
          connected: true,
          connectionState: 'connected',
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return res.json({
        success: true,
        message: 'Database already connected',
        data: {
          connected: true,
          connectionState: 'connected',
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          name: mongoose.connection.name,
          timestamp: new Date().toISOString()
        }
      });
    }

    // Connect to database with serverless-friendly options
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });

    res.json({
      success: true,
      message: 'Database connected successfully',
      data: {
        connected: true,
        connectionState: 'connected',
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to database',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/database/disconnect:
 *   post:
 *     summary: Disconnect from database
 *     description: Manually disconnect from the database
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Database disconnected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database disconnected successfully
 *       500:
 *         description: Disconnection failed
 */
// @desc    Disconnect from database
// @route   POST /api/database/disconnect
// @access  Public
router.post('/disconnect', async (req, res) => {
  try {
    await mongoose.disconnect();
    
    res.json({
      success: true,
      message: 'Database disconnected successfully'
    });
  } catch (error) {
    console.error('Database disconnection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect from database',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/database/test:
 *   get:
 *     summary: Test database operations
 *     description: Test basic database operations to ensure everything is working
 *     tags: [Database]
 *     responses:
 *       200:
 *         description: Database test completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database test completed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     connectionTest:
 *                       type: boolean
 *                       example: true
 *                     collectionsTest:
 *                       type: boolean
 *                       example: true
 *                     modelsTest:
 *                       type: boolean
 *                       example: true
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Database test failed
 */
// @desc    Test database operations
// @route   GET /api/database/test
// @access  Public
router.get('/test', async (req, res) => {
  try {
    const results = {
      connectionTest: false,
      collectionsTest: false,
      modelsTest: false,
      timestamp: new Date().toISOString(),
      details: {}
    };

    // Test 1: Connection
    if (mongoose.connection.readyState === 1) {
      results.connectionTest = true;
      results.details.connection = 'Connected successfully';
    } else {
      results.details.connection = `Connection state: ${mongoose.connection.readyState}`;
    }

    // Test 2: Collections
    if (results.connectionTest) {
      try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        results.collectionsTest = true;
        results.details.collections = collections.map(col => col.name);
      } catch (error) {
        results.details.collections = `Error: ${error.message}`;
      }
    }

    // Test 3: Models
    try {
      const User = require('../models/User');
      const Event = require('../models/Event');
      const Testimonial = require('../models/Testimonial');
      const Gallery = require('../models/Gallery');
      const Contact = require('../models/Contact');
      
      results.modelsTest = true;
      results.details.models = ['User', 'Event', 'Testimonial', 'Gallery', 'Contact'];
    } catch (error) {
      results.details.models = `Error: ${error.message}`;
    }

    const allTestsPassed = results.connectionTest && results.collectionsTest && results.modelsTest;

    res.json({
      success: allTestsPassed,
      message: allTestsPassed ? 'Database test completed successfully' : 'Database test completed with issues',
      data: results
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

module.exports = router;
