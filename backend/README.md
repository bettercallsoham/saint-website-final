# SAINT Backend API

A proxy API server for the SAINT (Student Association of Information Technology) website that interfaces with the external backend at `https://saint-data.vercel.app`.

## Features

- **Proxy Architecture**: Forwards requests to external API while providing additional middleware
- **Authentication**: JWT-based authentication with role-based access control
- **Rate Limiting**: Configurable rate limiting for API protection
- **Validation**: Input validation using express-validator
- **Logging**: Comprehensive logging with Winston
- **Security**: Helmet.js for security headers, CORS configuration
- **Compression**: Response compression for better performance

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers that call external API
│   ├── middleware/      # Authentication, validation, rate limiting
│   ├── routes/         # API route definitions
│   └── utils/          # Utilities (logger, API service)
├── server.js           # Server entry point
├── package.json        # Dependencies and scripts
└── .env.example        # Environment variables template
```

## Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Start production server**:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 5000 |
| `HOST` | Server host | localhost |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `EXTERNAL_API_URL` | External API URL | https://saint-data.vercel.app |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `ADMIN_EMAIL` | Admin user email | admin@saint.org |
| `ADMIN_PASSWORD` | Admin user password | (required) |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get specific member
- `POST /api/members` - Create new member (Admin only)

### Contact
- `POST /api/contact` - Submit contact form

### Gallery
- `GET /api/gallery` - Get gallery items
- `GET /api/gallery/:id` - Get specific gallery item
- `POST /api/gallery` - Create gallery item (Admin only)

### Database
- `GET /api/database/status` - Get database status
- `POST /api/database/connect` - Connect to database (Admin only)
- `POST /api/database/disconnect` - Disconnect from database (Admin only)
- `GET /api/database/test` - Test database operations

## Middleware

### Authentication Middleware
- `authenticate`: Verifies JWT token
- `requireAdmin`: Requires admin role

### Rate Limiting
- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

### Validation
- Input validation using express-validator
- Request body sanitization

## External API Integration

This backend acts as a proxy to the external SAINT API at `https://saint-data.vercel.app`. All data operations are forwarded to the external service while providing:

- Additional security layers
- Rate limiting
- Request/response logging
- Input validation
- Authentication middleware

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Adding New Endpoints

1. **Create controller** in `src/controllers/`
2. **Add route** in `src/routes/`
3. **Update app.js** to include new route
4. **Add validation** if needed

### Error Handling

The application includes comprehensive error handling:
- Global error middleware
- Graceful shutdown on process signals
- Unhandled promise rejection handling
- Request/response logging

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper JWT secrets
3. Set up proper CORS origins
4. Configure rate limiting for production load
5. Set up log rotation
6. Use process manager (PM2, systemd)

## Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Request sanitization
- **JWT Authentication**: Secure user sessions
- **Environment Variables**: Sensitive data protection

## Logging

Winston-based logging with configurable levels:
- Request/response logging
- Error logging with stack traces
- Structured logging format
- Configurable log levels and output

## License

MIT License - see LICENSE file for details.