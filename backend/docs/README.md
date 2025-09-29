# SAInT Backend API

A robust Node.js backend API for the SAInT (Students Association in Technology) website, built with Express.js and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based user authentication with role-based access control
- **Event Management** - CRUD operations for events with image uploads
- **Gallery Management** - Image gallery with upload and management capabilities
- **Testimonials** - User testimonials management system
- **Contact System** - Contact form handling with email notifications
- **Member Management** - User registration and profile management
- **API Documentation** - Swagger/OpenAPI documentation
- **Security** - Helmet, CORS, rate limiting, and input validation
- **File Uploads** - Multer-based file upload with size limits

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080
   
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload new image (Admin only)
- `DELETE /api/gallery/:id` - Delete image (Admin only)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin only)

### Contact
- `POST /api/contact` - Submit contact form

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Add new member (Admin only)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:8080 |

### Database Models

- **User** - User accounts and authentication
- **Event** - Event information and details
- **Gallery** - Image gallery management
- **Testimonial** - User testimonials
- **Contact** - Contact form submissions

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API request limiting
- **Input Validation** - Request validation using express-validator
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **API Spec**: `http://localhost:5000/api/swagger.json`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel Deployment

The project is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the project
2. Set production environment variables
3. Start with `npm start`

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   └── swagger.js    # API documentation
├── middleware/       # Custom middleware
│   ├── auth.js       # Authentication middleware
│   └── errorHandler.js # Error handling
├── models/          # Database models
│   ├── User.js
│   ├── Event.js
│   ├── Gallery.js
│   ├── Testimonial.js
│   └── Contact.js
├── routes/          # API routes
│   ├── auth.js
│   ├── events.js
│   ├── gallery.js
│   ├── testimonials.js
│   ├── contact.js
│   ├── members.js
│   └── database.js
├── uploads/         # File uploads
│   └── gallery/     # Gallery images
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**SAInT Development Team** - Building the future of student technology associations.