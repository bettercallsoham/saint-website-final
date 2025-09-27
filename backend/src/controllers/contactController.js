const apiService = require('../utils/apiService');


class ContactController {
  /**
   * Submit contact form
   */
  async submitContactForm(req, res) {
    try {
      const contactData = req.body;
      
      console.log('Submitting contact form via external API', { 
        name: contactData.name, 
        email: contactData.email,
        subject: contactData.subject 
      });
      
      const result = await apiService.submitContactForm(contactData);
      
      console.log('Contact form submitted successfully via external API', { 
        name: contactData.name, 
        email: contactData.email 
      });
      
      res.status(200).json(result.data);

    } catch (error) {
      console.error('Submit contact form error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit contact form',
        error: 'CONTACT_FORM_ERROR',
        details: error.error || error.message
      });
    }
  }
}

module.exports = new ContactController();
