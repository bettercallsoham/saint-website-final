const Joi = require('joi');

// User registration validation
const validateUserRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.string().pattern(/^[+]?[\d\s()-]{10,}$/).optional(),
    studentId: Joi.string().optional(),
    department: Joi.string().optional(),
    year: Joi.string().valid('1st', '2nd', '3rd', '4th', 'Alumni', 'Other').optional()
  });

  return schema.validate(data);
};

// Admin registration validation
const validateAdminRegistration = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    adminCode: Joi.string().required()
  });

  return schema.validate(data);
};

// Login validation
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

// Event creation validation
const validateEvent = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(2000).required(),
    date: Joi.alternatives().try(
      Joi.date().greater('now'),
      Joi.string().isoDate()
    ).required(),
    time: Joi.string().required(),
    venue: Joi.string().max(200).required(),
    speaker: Joi.object({
      name: Joi.string().max(100).allow('').optional(),
      designation: Joi.string().max(150).allow('').optional(),
      bio: Joi.string().max(1000).allow('').optional(),
      image: Joi.string().allow('').optional()
    }).allow(null).optional(),
    category: Joi.string().valid('workshop', 'seminar', 'competition', 'social', 'meeting', 'other').optional(),
    maxAttendees: Joi.number().min(1).max(1000).optional(),
    registrationRequired: Joi.boolean().optional(),
    registrationDeadline: Joi.alternatives().try(
      Joi.date(),
      Joi.string().isoDate()
    ).optional(),
    tags: Joi.array().items(Joi.string().max(30)).optional(),
    images: Joi.array().items(
      Joi.object({
        url: Joi.string().required(),
        caption: Joi.string().max(200).optional(),
        isPrimary: Joi.boolean().optional()
      })
    ).optional()
  });

  return schema.validate(data);
};

// Gallery item validation
const validateGalleryItem = (data, hasFile = false) => {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(500).allow('').optional(),
    imageUrl: hasFile ? Joi.string().allow('').optional() : Joi.string().required(),
    thumbnailUrl: Joi.string().allow('').optional(),
    category: Joi.string().valid('event', 'workshop', 'seminar', 'competition', 'social', 'achievement', 'other').optional(),
    eventName: Joi.string().max(100).allow('').optional(),
    date: Joi.date().optional(),
    photographer: Joi.string().max(100).allow('').optional(),
    tags: Joi.array().items(Joi.string().max(30)).optional(),
    isFeatured: Joi.boolean().optional()
  });

  return schema.validate(data);
};

// Contact form validation
const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().max(100).required(),
    message: Joi.string().max(1000).required(),
    phoneNumber: Joi.string().pattern(/^[+]?[\d\s()-]{10,}$/).optional(),
    category: Joi.string().valid('general', 'technical', 'event', 'membership', 'complaint', 'suggestion').optional()
  });

  return schema.validate(data);
};

module.exports = {
  validateUserRegistration,
  validateAdminRegistration,
  validateLogin,
  validateEvent,
  validateGalleryItem,
  validateContact
};