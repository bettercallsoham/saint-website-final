const Joi = require('joi');

/**
 * Generic validation middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown properties
      convert: true // Convert strings to appropriate types
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      console.log('Validation failed', { property, errors });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: errors
      });
    }

    // Replace the original data with validated data
    req[property] = value;
    next();
  };
};

/**
 * Validation schemas
 */
const schemas = {
  // User registration
  userRegistration: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'First name can only contain letters and spaces'
      }),
    
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Last name can only contain letters and spaces'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match'
      }),
    
    studentId: Joi.string()
      .pattern(/^[A-Z0-9]+$/)
      .optional()
      .messages({
        'string.pattern.base': 'Student ID can only contain uppercase letters and numbers'
      }),
    
    year: Joi.string()
      .valid('1', '2', '3', '4', 'Graduate')
      .optional(),
    
    department: Joi.string()
      .max(100)
      .optional(),
    
    phone: Joi.string()
      .pattern(/^[+]?[\d\s\-()]+$/)
      .min(10)
      .max(15)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      })
  }),

  // Admin registration
  adminRegistration: Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required(),
    
    lastName: Joi.string()
      .min(2)
      .max(50)
      .pattern(/^[a-zA-Z\s]+$/)
      .required(),
    
    email: Joi.string()
      .email()
      .required(),
    
    password: Joi.string()
      .min(10)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required(),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required(),
    
    adminSecret: Joi.string()
      .required()
      .messages({
        'any.required': 'Admin secret key is required'
      })
  }),

  // User login
  userLogin: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  // Contact form
  contactForm: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required(),
    
    email: Joi.string()
      .email()
      .required(),
    
    subject: Joi.string()
      .min(5)
      .max(200)
      .required(),
    
    message: Joi.string()
      .min(10)
      .max(2000)
      .required(),
    
    phone: Joi.string()
      .pattern(/^[+]?[\d\s\-()]+$/)
      .min(10)
      .max(15)
      .optional()
  }),

  // Event creation
  eventCreation: Joi.object({
    title: Joi.string()
      .min(5)
      .max(200)
      .required(),
    
    description: Joi.string()
      .min(20)
      .max(2000)
      .required(),
    
    date: Joi.date()
      .iso()
      .min('now')
      .required()
      .messages({
        'date.min': 'Event date must be in the future'
      }),
    
    time: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        'string.pattern.base': 'Time must be in HH:MM format'
      }),
    
    location: Joi.string()
      .min(5)
      .max(200)
      .required(),
    
    capacity: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .optional(),
    
    category: Joi.string()
      .valid('workshop', 'seminar', 'competition', 'meeting', 'social', 'other')
      .required(),
    
    featured: Joi.boolean()
      .default(false),
    
    registrationRequired: Joi.boolean()
      .default(false),
    
    tags: Joi.array()
      .items(Joi.string().max(30))
      .max(10)
      .optional()
  }),

  // Token refresh
  tokenRefresh: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Refresh token is required'
      })
  }),

  // ID parameter validation
  mongoId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ID format'
      })
  })
};

/**
 * Pre-built validation middlewares
 */
const validationMiddlewares = {
  validateUserRegistration: validate(schemas.userRegistration),
  validateAdminRegistration: validate(schemas.adminRegistration),
  validateUserLogin: validate(schemas.userLogin),
  validateContactForm: validate(schemas.contactForm),
  validateEventCreation: validate(schemas.eventCreation),
  validateTokenRefresh: validate(schemas.tokenRefresh),
  validateMongoId: validate(schemas.mongoId, 'params')
};

module.exports = {
  validate,
  schemas,
  ...validationMiddlewares
};
