# Development Guide

This guide covers the development setup, coding standards, and best practices for the SAInT Backend API.

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Git

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Install Husky hooks
npm run prepare

# Start development server
npm run dev
```

## 📝 Coding Standards

### ESLint Configuration
We use ESLint for code linting with the following rules:
- **Error Prevention**: No console logs in production, no unused variables
- **Code Style**: 2-space indentation, single quotes, semicolons
- **Best Practices**: Use const/let, prefer arrow functions, no var
- **Node.js Specific**: Proper require/import usage

### Prettier Configuration
We use Prettier for code formatting:
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Trailing Commas**: ES5 compatible
- **Print Width**: 80 characters
- **Tab Width**: 2 spaces

### Running Linting and Formatting
```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is formatted correctly
npm run format:check
```

## 🧪 Testing

### Jest Configuration
We use Jest for testing with the following setup:
- **Test Environment**: Node.js
- **Coverage**: HTML and LCOV reports
- **Timeout**: 10 seconds
- **Mocking**: Automatic cleanup after each test

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
```javascript
// Example test file: tests/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
  test('POST /api/auth/register should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });
});
```

## 🔒 Validation with Zod

We use Zod for runtime type validation. All API endpoints should use Zod schemas for input validation.

### Using Zod Schemas
```javascript
const { validate, userSchema } = require('../utils/validation');

// In your route
router.post('/register', validate(userSchema), async (req, res) => {
  // req.body is already validated by Zod
  const { name, email, password, role } = req.body;
  // ... rest of your logic
});
```

### Available Schemas
- `userSchema` - User registration
- `loginSchema` - User login
- `eventSchema` - Event creation
- `gallerySchema` - Gallery item creation
- `testimonialSchema` - Testimonial creation
- `contactSchema` - Contact form submission
- `memberSchema` - Member registration

## 🚀 Git Hooks with Husky

### Pre-commit Hook
Automatically runs before each commit:
- ESLint fixes
- Prettier formatting
- Lint-staged validation

### Commit Message Hook
Enforces conventional commit format:
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): add user login functionality
```

### Bypassing Hooks (Emergency Only)
```bash
# Skip pre-commit hooks
git commit --no-verify -m "fix: emergency fix"

# Skip commit message validation
git commit --no-verify -m "fix: emergency fix"
```

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
├── middleware/       # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── utils/           # Utility functions
│   └── validation.js # Zod schemas
├── tests/           # Test files
│   └── setup.js     # Test setup
├── uploads/         # File uploads
├── .husky/          # Git hooks
├── .eslintrc.js     # ESLint config
├── .prettierrc      # Prettier config
├── jest.config.js   # Jest config
└── server.js        # Main server file
```

## 🔧 Environment Variables

### Development
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/saint-dev
JWT_SECRET=your-dev-secret
```

### Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/saint-prod
JWT_SECRET=your-production-secret
```

## 🐛 Debugging

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev

# Run specific debug modules
DEBUG=express:router npm run dev
```

### Common Issues
1. **Port already in use**: Change PORT in .env
2. **MongoDB connection failed**: Check MONGODB_URI
3. **JWT errors**: Verify JWT_SECRET is set
4. **File upload issues**: Check uploads directory permissions

## 📊 Performance Monitoring

### Logging
- **Morgan**: HTTP request logging
- **Console**: Application logs
- **Error Handling**: Centralized error logging

### Metrics
- **Response Time**: Track API response times
- **Memory Usage**: Monitor memory consumption
- **Database Queries**: Log slow queries

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No linting errors
- [ ] Code formatted with Prettier
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Security headers configured

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🤝 Contributing

### Pull Request Process
1. Create feature branch
2. Make changes
3. Run tests and linting
4. Commit with conventional format
5. Push and create PR
6. Code review
7. Merge to main

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests are included
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Security considerations addressed

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Jest Documentation](https://jestjs.io/)
- [Zod Documentation](https://zod.dev/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Husky Documentation](https://typicode.github.io/husky/)

---

**Happy Coding!** 🚀
