const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const swaggerUi = require('swagger-ui-express'); // Using custom implementation for Vercel
require('dotenv').config();

// Lazy load database connection for Vercel compatibility
let connectDB;
let swaggerSpecs;
let errorHandler;

try {
  connectDB = require('./config/database');
  swaggerSpecs = require('./config/swagger');
  errorHandler = require('./middleware/errorHandler');
} catch (error) {
  console.error('Error loading modules:', error);
}

// Import routes
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const memberRoutes = require('./routes/members');
const contactRoutes = require('./routes/contact');
const galleryRoutes = require('./routes/gallery');
const testimonialRoutes = require('./routes/testimonials');
const databaseRoutes = require('./routes/database');

const app = express();

// Connect to MongoDB
// Connect to database in all environments
if (connectDB) {
  connectDB().catch(error => {
    console.error('Database connection failed on startup:', error);
  });
}

// Security middleware with CSP configuration for Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
      connectSrc: [
        "'self'", 
        "https://unpkg.com",
        "http://localhost:*",
        "https://localhost:*",
        "https://saint-data.vercel.app",
        "https://*.vercel.app"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests, or Swagger UI)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost ports
    if (process.env.NODE_ENV === 'development') {
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost) {
        return callback(null, true);
      }
    }
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:8081',
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8083',
      'http://localhost:8084',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:8080',
      'http://127.0.0.1:8081',
      'http://127.0.0.1:8082',
      'http://127.0.0.1:8083',
      'http://127.0.0.1:8084',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
      // Production frontend URLs
      'https://your-frontend-domain.vercel.app',
      'https://saint-website.vercel.app',
      // Allow Swagger UI from same domain
      'https://saint-data.vercel.app',
      'https://saint-data-*.vercel.app',
      // Allow all Vercel domains for development
      'https://*.vercel.app'
    ];
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard domains
        const pattern = allowedOrigin.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Additional CORS handling for Swagger UI
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow Swagger UI from same domain and common origins
  const allowedOrigins = [
    'https://saint-data.vercel.app',
    'https://saint-data-akmtl2cgr-phcoder05s-projects.vercel.app',
    'https://saint-data-ewll8w1u4-phcoder05s-projects.vercel.app',
    'https://saint-data-1zeuuk8s3-phcoder05s-projects.vercel.app',
    'https://saint-data-n2eyqul28-phcoder05s-projects.vercel.app',
    'http://localhost:5000',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  // Check if origin is allowed
  if (origin && (allowedOrigins.includes(origin) || origin.includes('saint-data') || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    // Allow requests with no origin (like Swagger UI internal requests)
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Swagger Documentation - Custom handler for Vercel
app.get('/api-docs', (req, res) => {
  if (!swaggerSpecs) {
    return res.status(500).json({ error: 'Swagger specs not available' });
  }
  
  // Generate nonce for CSP
  const nonce = require('crypto').randomBytes(16).toString('base64');
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SAInT API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
  <style nonce="${nonce}">
    .swagger-ui .topbar { display: none }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script nonce="${nonce}" src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
  <script nonce="${nonce}" src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
  <script nonce="${nonce}">
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: '/api/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null,
        tryItOutEnabled: true,
        onComplete: function() {
          console.log('Swagger UI loaded successfully');
          
          // Automatically select the correct server based on environment
          const currentHost = window.location.host;
          const isLocalhost = currentHost.includes('localhost') || currentHost.includes('127.0.0.1');
          
          if (!isLocalhost) {
            // For production, select the production server
            const serverSelect = document.querySelector('.servers select');
            if (serverSelect) {
              // Find and select the production server option
              const options = serverSelect.options;
              for (let i = 0; i < options.length; i++) {
                if (options[i].textContent.includes('Production')) {
                  serverSelect.selectedIndex = i;
                  serverSelect.dispatchEvent(new Event('change'));
                  break;
                }
              }
            }
          }
        },
        requestInterceptor: function(request) {
          // Ensure requests use the correct base URL
          const currentHost = window.location.host;
          const isLocalhost = currentHost.includes('localhost') || currentHost.includes('127.0.0.1');
          
          // For production, ensure we're using the correct domain
          if (!isLocalhost && request.url.startsWith('/api/')) {
            request.url = 'https://saint-data.vercel.app' + request.url;
          } else if (!isLocalhost && request.url.startsWith('/')) {
            request.url = 'https://saint-data.vercel.app/api' + request.url;
          }
          
          console.log('Swagger UI Request:', request.url);
          return request;
        }
      });
    };
  </script>
</body>
</html>`;
  
  // Set CSP header with nonce
  res.setHeader('Content-Security-Policy', 
    `default-src 'self'; ` +
    `style-src 'self' 'unsafe-inline' https://unpkg.com; ` +
    `script-src 'self' 'nonce-${nonce}' https://unpkg.com; ` +
    `connect-src 'self' https://unpkg.com http://localhost:* https://localhost:* https://saint-data.vercel.app https://*.vercel.app; ` +
    `img-src 'self' data: https:; ` +
    `font-src 'self' https: data:; ` +
    `object-src 'none'; ` +
    `media-src 'self'; ` +
    `frame-src 'none';`
  );
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// Serve Swagger JSON spec
app.get('/api/swagger.json', (req, res) => {
  if (!swaggerSpecs) {
    return res.status(500).json({ error: 'Swagger specs not available' });
  }
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpecs);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'SAInT Backend API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      docs: '/api-docs',
      swagger: '/api/swagger.json'
    }
  });
});

// Redirect /health to /api/health for convenience
app.get('/health', (req, res) => {
  res.redirect('/api/health');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const connectionStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.json({ 
      status: 'OK', 
      message: 'SAInT Backend API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: connectionStates[dbStatus],
        connected: dbStatus === 1,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown'
      },
      environment_variables: {
        has_jwt_secret: !!process.env.JWT_SECRET,
        has_mongodb_uri: !!process.env.MONGODB_URI,
        node_env: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Health check failed',
      error: error.message 
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/database', databaseRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

// Error handling middleware
if (errorHandler) {
  app.use(errorHandler);
} else {
  // Fallback error handler
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  });
}

const PORT = process.env.PORT || 5000;

// For Vercel, we need to export the app instead of listening
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`🚀 SAInT Backend server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  });
}
