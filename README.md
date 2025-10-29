# SAInT Club Website.

A modern, comprehensive web application for managing SAInT (Student Association in Technology) club activities, built with React TypeScript frontend and Node.js/Express backend.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Development Journey](#development-journey)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Security Features](#security-features)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Project Overview

The SAInT Club Website is a full-featured web application designed to manage all aspects of a technology student club. It provides both public-facing pages for visitors and a comprehensive admin dashboard for club management.

### Key Objectives
- **Member Management**: Complete system for handling club memberships and core team profiles
- **Event Management**: Create, manage, and track events with RSVP functionality
- **Content Management**: Admin dashboard for managing website content, gallery, and announcements
- **User Authentication**: Secure login system with role-based access control
- **Responsive Design**: Modern, mobile-first design using Tailwind CSS and shadcn/ui

## 🚀 Development Journey

This project evolved through several major development phases:

### Phase 1: Foundation & Authentication
- Set up full-stack architecture with React TypeScript frontend and Node.js/Express backend
- Implemented secure authentication system with JWT tokens
- Created user registration and login functionality
- Built admin authentication with role-based access control

### Phase 2: Core Features Development
- **Enhanced Event Management**: Comprehensive event creation, editing, and management system
- **Gallery Management**: Multi-image upload system with thumbnail support
- **User Ban System**: Advanced user moderation with ban/unban functionality
- **Advanced RSVP System**: Detailed event registration with participant tracking

### Phase 3: Admin Dashboard Overhaul
- Complete redesign of admin interface with modern, responsive layout
- Enhanced event management UI with better visualizations
- Comprehensive user management system with advanced controls
- Gallery display improvements with proper image handling

### Phase 4: Content & Infrastructure
- **Core Team Integration**: Added 37 core team members from organizational chart
- **Video Infrastructure**: Complete video player system with modal dialogs and thumbnails
- **Member Profile System**: Enhanced member profiles with designation hierarchy
- **UI/UX Refinements**: Professional styling and improved user experience

### Phase 5: Polish & Quality
- **CORS Configuration**: Comprehensive cross-origin resource sharing setup
- **Error Handling**: Replaced all browser alerts with React-based confirmation dialogs
- **Type Safety**: Enhanced TypeScript integration across the entire application
- **Performance Optimization**: Optimized queries, caching, and API responses

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Vite 5.4.19** - Fast build tool and development server
- **TanStack Query 5.83.0** - Data fetching, caching, and synchronization
- **React Router DOM 6.30.1** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **MongoDB with Mongoose 8.0.3** - NoSQL database with ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication and authorization
- **bcryptjs 2.4.3** - Password hashing
- **Multer 1.4.5** - File upload handling
- **Cloudinary 1.41.0** - Image storage and optimization

### Security & Middleware
- **Helmet 7.1.0** - Security headers
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Rate Limit 7.1.5** - API rate limiting
- **Morgan 1.10.0** - HTTP request logging

## ✨ Features

### Public Features
- **Landing Page**: Modern, interactive hero section with club information
- **Events Showcase**: Display of upcoming and past events
- **Gallery**: Photo gallery with categorized images
- **Member Profiles**: Core team and member directory
- **Contact System**: Contact form with inquiry management
- **Video Highlights**: Event video showcase with custom player

### Authentication System
- **User Registration**: Secure account creation with validation
- **Login/Logout**: JWT-based authentication
- **Role Management**: User and admin role separation
- **Password Security**: Bcrypt hashing with salt rounds

### Admin Dashboard
- **Dashboard Overview**: Statistics and analytics
- **Event Management**: 
  - Create, edit, and delete events
  - Image upload and management
  - RSVP tracking and management
  - Attendance management with CSV export
- **User Management**:
  - View all users with search and filters
  - Update user roles (user/admin)
  - Ban/unban users
  - Permanent user deletion
- **Gallery Management**:
  - Single and multiple image uploads
  - Image categorization and metadata
  - Featured image selection
- **Content Management**: Dynamic content updates

### Advanced Features
- **File Upload System**: Multi-file upload with validation
- **Image Processing**: Thumbnail generation and optimization
- **Search & Filtering**: Advanced search across all content
- **Responsive Design**: Mobile-first, fully responsive interface
- **Toast Notifications**: User-friendly feedback system
- **Confirmation Dialogs**: Professional confirmation system replacing browser alerts
- **Error Handling**: Comprehensive error management with user-friendly messages

## 📁 Project Structure

```
saint-website-final/
├── frontend/                          # React TypeScript Frontend
│   ├── public/                        # Static assets
│   │   ├── images/
│   │   │   └── video-thumbnails/      # Video thumbnail images
│   │   └── videos/
│   │       └── highlights/            # Event highlight videos
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   │   ├── alert-dialog.tsx   # Alert dialog component
│   │   │   │   ├── confirm-dialog.tsx # Custom confirmation dialog
│   │   │   │   └── ...               # Other UI components
│   │   │   ├── AboutSection.tsx       # About section component
│   │   │   ├── EventsSection.tsx      # Events display component
│   │   │   ├── GallerySection.tsx     # Gallery display component
│   │   │   ├── Navigation.tsx         # Main navigation component
│   │   │   └── VideoPlayer.tsx        # Custom video player
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useAdminApi.ts         # Admin API operations
│   │   │   ├── useAuth.ts             # Authentication hooks
│   │   │   ├── useEvents.ts           # Event management hooks
│   │   │   └── useMembers.ts          # Member management hooks
│   │   ├── pages/                     # Application pages
│   │   │   ├── AdminDashboard.tsx     # Comprehensive admin interface
│   │   │   ├── Events.tsx             # Public events page
│   │   │   ├── Gallery.tsx            # Public gallery page
│   │   │   ├── Members.tsx            # Member directory
│   │   │   └── ...                   # Other pages
│   │   ├── services/                  # API service layer
│   │   │   ├── apiService.ts          # Base API service
│   │   │   ├── authApi.ts             # Authentication services
│   │   │   ├── eventsApi.ts           # Event services
│   │   │   └── ...                   # Other API services
│   │   └── lib/                       # Utility functions
│   └── package.json                   # Frontend dependencies
├── backend/                           # Node.js Express Backend
│   ├── controllers/                   # Request handlers
│   │   ├── adminController.js         # Admin operations
│   │   ├── authController.js          # Authentication logic
│   │   ├── eventsController.js        # Event management
│   │   ├── galleryController.js       # Gallery operations
│   │   └── membersController.js       # Member management
│   ├── models/                        # MongoDB/Mongoose models
│   │   ├── User.js                    # User model with authentication
│   │   ├── Event.js                   # Event model with RSVP tracking
│   │   ├── Gallery.js                 # Gallery model with image metadata
│   │   ├── Member.js                  # Core team member model
│   │   └── Contact.js                 # Contact inquiry model
│   ├── routes/                        # API route definitions
│   │   ├── admin.js                   # Admin-only routes
│   │   ├── auth.js                    # Authentication routes
│   │   ├── events.js                  # Event CRUD routes
│   │   ├── gallery.js                 # Gallery management routes
│   │   └── members.js                 # Member routes
│   ├── middleware/                    # Custom middleware
│   │   ├── auth.js                    # JWT authentication
│   │   └── upload.js                  # File upload handling
│   ├── scripts/                       # Database scripts
│   │   └── populateCoreTeam.js        # Core team data population
│   ├── uploads/                       # File storage directory
│   │   └── gallery/                   # Uploaded gallery images
│   ├── utils/                         # Utility functions
│   │   ├── jwt.js                     # JWT utilities
│   │   └── validation.js              # Input validation
│   ├── server.js                      # Main server file
│   └── package.json                   # Backend dependencies
├── .gitignore                         # Git ignore rules
└── README.md                          # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/bettercallsoham/saint-website-final.git
cd saint-website-final
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/saint_club
# JWT_SECRET=your_super_secret_jwt_key
# JWT_EXPIRE=30d
# NODE_ENV=development
# PORT=5000

# Populate core team data (optional)
node scripts/populateCoreTeam.js

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file (optional)
# Create .env.local for any frontend-specific variables

# Start frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### 5. Admin Account Setup
Create an admin account by registering a user and manually updating their role in the database:
```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/users/register          # User registration
POST /api/users/login             # User login
GET  /api/users/me               # Get current user
PUT  /api/users/profile          # Update user profile

POST /api/admin/auth/register    # Admin registration
POST /api/admin/auth/login       # Admin login
```

### Event Endpoints
```
GET    /api/events               # Get all events (public)
POST   /api/events               # Create event (admin)
GET    /api/events/:id           # Get single event
PUT    /api/events/:id           # Update event (admin)
DELETE /api/events/:id           # Delete event (admin)
POST   /api/events/:id/rsvp      # RSVP to event (authenticated)
GET    /api/events/:id/rsvps     # Get event RSVPs (admin)
```

### Member Endpoints
```
GET    /api/members              # Get all members
GET    /api/members/core         # Get core team members
POST   /api/members              # Create member (admin)
PUT    /api/members/:id          # Update member (admin)
DELETE /api/members/:id          # Delete member (admin)
```

### Gallery Endpoints
```
GET    /api/gallery              # Get gallery items
POST   /api/gallery              # Create gallery item (admin)
POST   /api/gallery/multiple     # Create multiple gallery items (admin)
PUT    /api/gallery/:id          # Update gallery item (admin)
DELETE /api/gallery/:id          # Delete gallery item (admin)
```

### Admin Endpoints
```
GET    /api/admin/dashboard      # Dashboard statistics
GET    /api/admin/users          # Get all users
PUT    /api/admin/users/:id/role # Update user role
POST   /api/admin/users/:id/ban  # Ban user
POST   /api/admin/users/:id/unban # Unban user
DELETE /api/admin/users/:id/permanent # Permanently delete user
```

## 🗄 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  status: String (enum: ['active', 'banned', 'suspended']),
  phoneNumber: String,
  studentId: String,
  department: String,
  year: String,
  isActive: Boolean,
  joinedAt: Date,
  lastLogin: Date
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  category: String,
  maxAttendees: Number,
  registrationRequired: Boolean,
  registrationDeadline: Date,
  speaker: {
    name: String,
    designation: String,
    bio: String
  },
  images: [{
    url: String,
    isPrimary: Boolean
  }],
  rsvps: [ObjectId],
  status: String,
  isActive: Boolean
}
```

### Member Model
```javascript
{
  name: String,
  email: String,
  designation: String,
  skills: [String],
  bio: String,
  profilePicture: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  isActive: Boolean,
  displayOrder: Number
}
```

## 🏗 Frontend Architecture

### Component Structure
- **Pages**: Top-level route components
- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for data fetching and state management
- **Services**: API interaction layer
- **Utils**: Helper functions and utilities

### State Management
- **TanStack Query**: Server state management and caching
- **React Hooks**: Local component state
- **Context API**: Global application state (authentication)

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built, customizable components
- **CSS Variables**: Theme customization
- **Responsive Design**: Mobile-first approach

## ⚙ Backend Architecture

### Architecture Pattern
- **MVC Pattern**: Model-View-Controller architecture
- **RESTful API**: Standard REST endpoints
- **Middleware Pipeline**: Authentication, validation, error handling
- **Service Layer**: Business logic separation

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request throttling
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Joi schema validation
- **Security Headers**: Helmet middleware

### File Management
- **Multer**: File upload handling
- **Static Serving**: Express static file serving
- **Image Processing**: Thumbnail generation support

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with secure token generation
- Role-based access control (user/admin)
- Password hashing with bcrypt (12 salt rounds)
- Secure logout with token invalidation

### API Security
- Rate limiting (100 requests per 15 minutes)
- CORS configuration with specific origins
- Security headers via Helmet
- Input validation and sanitization
- SQL injection prevention via Mongoose ODM

### Data Protection
- Sensitive data exclusion in API responses
- Secure file upload with validation
- User status management (active/banned/suspended)
- Admin-only endpoints protection

## 📋 Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React hooks plugin
- **Prettier**: Code formatting (recommended)
- **Naming**: Clear, descriptive variable and function names

### Git Workflow
- **Feature Branches**: Create branches for new features
- **Commit Messages**: Clear, descriptive commit messages
- **Pull Requests**: Code review before merging

### Testing
- **Manual Testing**: Comprehensive manual testing performed
- **API Testing**: Postman/Thunder Client for API endpoints
- **Browser Testing**: Cross-browser compatibility testing

## 🚀 Deployment

### Production Checklist
1. Update environment variables for production
2. Configure production MongoDB instance
3. Set up proper CORS origins
4. Configure file storage (local or cloud)
5. Set up SSL certificates
6. Configure reverse proxy (Nginx recommended)

### Environment Variables
#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/saint_club
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
NODE_ENV=production
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_APP_NAME=SAInT Club
```

### Deployment Options
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Heroku, Railway, DigitalOcean, or AWS
- **Database**: MongoDB Atlas (recommended for production)
- **File Storage**: Cloudinary, AWS S3, or local storage

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Contribution Guidelines
- Follow the existing code style
- Add proper TypeScript types
- Test your changes thoroughly
- Update documentation as needed
- Write clear commit messages

## 📈 Future Enhancements

### Planned Features
- **Email Notifications**: Event reminders and updates
- **Calendar Integration**: Google Calendar sync
- **Payment Integration**: Event fees and membership dues
- **Mobile App**: React Native companion app
- **Analytics Dashboard**: Advanced analytics and reporting
- **Chat System**: Real-time member communication
- **Blog System**: News and article publishing


## 📞 Support

For support, questions, or contributions:
- **Repository**: [saint-website-final](https://github.com/bettercallsoham/saint-website-final)
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Documentation**: This README and inline code comments

**SAInT Club Website** - A comprehensive full-stack solution for modern student organization management.

Built with ❤️ and ☕ by Soham <3.