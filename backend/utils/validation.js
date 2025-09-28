const { z } = require('zod');

// User validation schemas
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['user', 'admin']).optional(),
});

// Event validation schemas
const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  date: z.string().datetime('Invalid date format'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(100, 'Location must be less than 100 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters').max(50, 'Category must be less than 50 characters'),
  isActive: z.boolean().optional().default(true),
});

const updateEventSchema = eventSchema.partial();

// Gallery validation schemas
const gallerySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters').optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').max(50, 'Category must be less than 50 characters'),
  isActive: z.boolean().optional().default(true),
});

const updateGallerySchema = gallerySchema.partial();

// Testimonial validation schemas
const testimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500, 'Message must be less than 500 characters'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  isApproved: z.boolean().optional().default(false),
});

const updateTestimonialSchema = testimonialSchema.partial();

// Contact validation schemas
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  phone: z.string().optional(),
});

// Member validation schemas
const memberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email format'),
  studentId: z.string().min(3, 'Student ID must be at least 3 characters').max(20, 'Student ID must be less than 20 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters').max(50, 'Department must be less than 50 characters'),
  year: z.number().min(1, 'Year must be at least 1').max(10, 'Year must be at most 10'),
  position: z.string().min(2, 'Position must be at least 2 characters').max(50, 'Position must be less than 50 characters').optional(),
  isActive: z.boolean().optional().default(true),
});

const updateMemberSchema = memberSchema.partial();

// Query parameter validation schemas
const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
  sort: z.string().optional().default('-createdAt'),
});

const searchSchema = z.object({
  q: z.string().min(1, 'Search query must be at least 1 character').optional(),
  category: z.string().optional(),
  status: z.string().optional(),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors,
        });
      }
      next(error);
    }
  };
};

// Query validation middleware
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Query validation error',
          errors,
        });
      }
      next(error);
    }
  };
};

module.exports = {
  // Schemas
  userSchema,
  loginSchema,
  updateUserSchema,
  eventSchema,
  updateEventSchema,
  gallerySchema,
  updateGallerySchema,
  testimonialSchema,
  updateTestimonialSchema,
  contactSchema,
  memberSchema,
  updateMemberSchema,
  paginationSchema,
  searchSchema,
  
  // Middleware
  validate,
  validateQuery,
};
