const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SAInT API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for SAInT (Students Association in Technology) website backend',
      contact: {
        name: 'SAInT Development Team',
        email: 'dev@saint.org',
        url: 'https://saint.org'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'https://saint-data.vercel.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['student', 'admin', 'faculty'],
              description: 'User role'
            },
            studentId: {
              type: 'string',
              description: 'Student ID number'
            },
            year: {
              type: 'string',
              enum: ['1st', '2nd', '3rd', '4th', 'Graduate', 'Alumni'],
              description: 'Academic year'
            },
            department: {
              type: 'string',
              enum: ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Other'],
              description: 'Department'
            },
            skills: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'User skills'
            },
            bio: {
              type: 'string',
              description: 'User biography'
            },
            profileImage: {
              type: 'string',
              description: 'Profile image URL'
            },
            socialLinks: {
              type: 'object',
              properties: {
                linkedin: { type: 'string' },
                github: { type: 'string' },
                twitter: { type: 'string' },
                website: { type: 'string' }
              }
            },
            isActive: {
              type: 'boolean',
              description: 'Account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Event unique identifier'
            },
            title: {
              type: 'string',
              description: 'Event title'
            },
            description: {
              type: 'string',
              description: 'Event description'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Event start date and time'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'Event end date and time'
            },
            location: {
              type: 'string',
              description: 'Event location'
            },
            category: {
              type: 'string',
              enum: ['workshop', 'hackathon', 'seminar', 'meeting', 'social', 'competition', 'other'],
              description: 'Event category'
            },
            maxParticipants: {
              type: 'number',
              description: 'Maximum number of participants'
            },
            registeredCount: {
              type: 'number',
              description: 'Current number of registered participants'
            },
            isActive: {
              type: 'boolean',
              description: 'Event status'
            },
            organizer: {
              $ref: '#/components/schemas/User'
            },
            registeredUsers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              },
              description: 'List of registered users'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Testimonial: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Testimonial unique identifier'
            },
            name: {
              type: 'string',
              description: 'Author name'
            },
            role: {
              type: 'string',
              description: 'Author role'
            },
            company: {
              type: 'string',
              description: 'Author company'
            },
            content: {
              type: 'string',
              description: 'Testimonial content'
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Rating from 1 to 5'
            },
            isApproved: {
              type: 'boolean',
              description: 'Approval status'
            },
            isFeatured: {
              type: 'boolean',
              description: 'Featured status'
            },
            author: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        GalleryItem: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Gallery item unique identifier'
            },
            title: {
              type: 'string',
              description: 'Gallery item title'
            },
            description: {
              type: 'string',
              description: 'Gallery item description'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Image URLs'
            },
            category: {
              type: 'string',
              enum: ['event', 'workshop', 'hackathon', 'meeting', 'social', 'achievement', 'other'],
              description: 'Gallery category'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Tags for filtering'
            },
            isFeatured: {
              type: 'boolean',
              description: 'Featured status'
            },
            likeCount: {
              type: 'number',
              description: 'Number of likes'
            },
            views: {
              type: 'number',
              description: 'Number of views'
            },
            uploadedBy: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Contact: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Contact unique identifier'
            },
            name: {
              type: 'string',
              description: 'Contact person name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Contact email'
            },
            subject: {
              type: 'string',
              description: 'Contact subject'
            },
            message: {
              type: 'string',
              description: 'Contact message'
            },
            phone: {
              type: 'string',
              description: 'Contact phone number'
            },
            category: {
              type: 'string',
              enum: ['general', 'support', 'partnership', 'feedback', 'complaint', 'other'],
              description: 'Contact category'
            },
            status: {
              type: 'string',
              enum: ['new', 'in-progress', 'resolved', 'closed'],
              description: 'Contact status'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'urgent'],
              description: 'Contact priority'
            },
            response: {
              type: 'string',
              description: 'Admin response'
            },
            respondedBy: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Events',
        description: 'Event management endpoints'
      },
      {
        name: 'Members',
        description: 'Member management endpoints'
      },
      {
        name: 'Contact',
        description: 'Contact form and inquiry management'
      },
      {
        name: 'Gallery',
        description: 'Gallery and media management'
      },
      {
        name: 'Testimonials',
        description: 'Testimonial management'
      },
          {
            name: 'Database',
            description: 'Database connection and management endpoints'
          },
          {
            name: 'Admin',
            description: 'Administrative endpoints for user management and RBAC'
          },
      {
        name: 'System',
        description: 'System health and utility endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './swagger-complete.js'] // Path to the API docs
};

const specs = swaggerJSDoc(options);

module.exports = specs;
