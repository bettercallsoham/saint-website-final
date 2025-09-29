const express = require('express');
const contactController = require('../controllers/contactController');
const { validateContactForm } = require('../middleware/validation');

const router = express.Router();

/**
 * @route   POST /api/contact
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', validateContactForm, contactController.submitContactForm);

module.exports = router;
