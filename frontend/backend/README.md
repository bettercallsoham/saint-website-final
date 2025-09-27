# SAInT Backend API

A comprehensive Node.js backend API for the SAInT (Society of Artificial Intelligence and Technology) website with complete RBAC (Role-Based Access Control) system.

## 🚀 Features

- **Authentication System**: JWT-based authentication with refresh tokens
- **RBAC System**: Complete role-based access control (student, admin, faculty)
- **User Management**: Full CRUD operations for user management
- **Event Management**: Create, read, update, delete events
- **Testimonials**: Manage user testimonials
- **Gallery**: Image gallery management
- **Contact Form**: Handle contact form submissions
- **Database Management**: MongoDB integration with connection management
- **API Documentation**: Complete Swagger UI documentation

## 🔐 RBAC System

### User Roles
- **student**: Default role for registered users
- **admin**: Administrative users with full access
- **faculty**: Faculty/staff members with extended permissions

### Admin Endpoints
- `GET /api/auth/admin/users` - List all users with pagination
- `GET /api/auth/admin/users/:id` - Get user details
- `PUT /api/auth/admin/users/:id/role` - Update user role
- `PUT /api/auth/admin/users/:id/status` - Activate/deactivate users
- `DELETE /api/auth/admin/users/:id` - Delete users
- `GET /api/auth/admin/stats` - Get user statistics
- `POST /api/auth/admin/create-admin` - Create admin users

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/token` - Generate access token
- `GET /api/auth/validate` - Validate token
- `GET /api/auth/token-info` - Get token information
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin/faculty)
- `GET /api/events/:id` - Get specific event
- `PUT /api/events/:id` - Update event (admin/faculty)
- `DELETE /api/events/:id` - Delete event (admin/faculty)

### Members
- `GET /api/members` - Get all members

### Contact
- `POST /api/contact` - Submit contact form

### Gallery
- `GET /api/gallery` - Get gallery items
- `POST /api/gallery` - Upload gallery item (admin)

### Testimonials
- `GET /api/testimonials` - Get testimonials
- `POST /api/testimonials` - Create testimonial (admin)

### Database
- `GET /api/database/status` - Get database status
- `POST /api/database/connect` - Connect to database
- `POST /api/database/test` - Test database connection

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saint-db
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:8081
   ```

5. Start the server:
   ```bash
   npm start
   ```

## 🚀 Deployment

The API is configured for deployment on Vercel with the following features:
- Serverless functions
- MongoDB Atlas integration
- Environment variable management
- CORS configuration
- Security headers

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📚 API Documentation

Visit `/api-docs` when the server is running to access the complete Swagger UI documentation.

## 🔧 Configuration

### Database
- MongoDB Atlas connection
- Mongoose ODM
- Connection pooling for serverless environments

### Security
- JWT authentication
- Password hashing with bcrypt
- CORS configuration
- Helmet security headers
- Rate limiting

### Validation
- Express-validator for request validation
- Comprehensive error handling
- Input sanitization

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
