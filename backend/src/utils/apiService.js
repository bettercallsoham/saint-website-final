class ApiService {
  constructor() {
    this.baseURL = 'https://saint-data.vercel.app';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'User-Agent': 'SAInT-Frontend-API/1.0.0'
    };
  }

  /**
   * Make HTTP request to external API
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        method: options.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        }
      };

      // Add body for POST/PUT requests
      if (options.body && (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')) {
        config.body = JSON.stringify(options.body);
      }

      // Add authorization header if token provided
      if (options.token) {
        config.headers.Authorization = `Bearer ${options.token}`;
      }

      console.log(`Making ${config.method} request to: ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.warn(`API request failed: ${response.status}`, { url, data });
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      console.log(`API request successful: ${response.status}`, { url });
      return {
        success: true,
        data,
        status: response.status,
        headers: response.headers
      };

    } catch (error) {
      console.error('API request error:', { endpoint, error: error.message });
      throw {
        success: false,
        error: error.message,
        endpoint
      };
    }
  }

  /**
   * Authentication API calls
   */
  async register(userData) {
    return this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async login(credentials) {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  async refreshToken(refreshToken) {
    return this.makeRequest('/api/auth/token', {
      method: 'POST',
      body: { refreshToken }
    });
  }

  async validateToken(token) {
    return this.makeRequest('/api/auth/validate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  async getTokenInfo(token) {
    return this.makeRequest('/api/auth/token-info', {
      method: 'GET',
      token
    });
  }

  /**
   * Events API calls
   */
  async getAllEvents() {
    return this.makeRequest('/api/events');
  }

  async createEvent(eventData, token) {
    return this.makeRequest('/api/events', {
      method: 'POST',
      body: eventData,
      token
    });
  }

  async getEventById(eventId) {
    return this.makeRequest(`/api/events/${eventId}`);
  }

  async updateEvent(eventId, eventData, token) {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'PUT',
      body: eventData,
      token
    });
  }

  async deleteEvent(eventId, token) {
    return this.makeRequest(`/api/events/${eventId}`, {
      method: 'DELETE',
      token
    });
  }

  /**
   * Members API calls
   */
  async getAllMembers() {
    return this.makeRequest('/api/members');
  }

  async getMemberById(memberId) {
    return this.makeRequest(`/api/members/${memberId}`);
  }

  async createMember(memberData, token) {
    return this.makeRequest('/api/members', {
      method: 'POST',
      body: memberData,
      token
    });
  }

  /**
   * Contact API calls
   */
  async submitContactForm(contactData) {
    return this.makeRequest('/api/contact', {
      method: 'POST',
      body: contactData
    });
  }

  /**
   * Gallery API calls
   */
  async getAllGalleryItems() {
    return this.makeRequest('/api/gallery');
  }

  async getGalleryItemById(itemId) {
    return this.makeRequest(`/api/gallery/${itemId}`);
  }

  async createGalleryItem(itemData, token) {
    return this.makeRequest('/api/gallery', {
      method: 'POST',
      body: itemData,
      token
    });
  }

  /**
   * Database API calls
   */
  async getDatabaseStatus() {
    return this.makeRequest('/api/database/status');
  }

  async connectDatabase() {
    return this.makeRequest('/api/database/connect', {
      method: 'POST'
    });
  }

  async disconnectDatabase() {
    return this.makeRequest('/api/database/disconnect', {
      method: 'POST'
    });
  }

  async testDatabase() {
    return this.makeRequest('/api/database/test');
  }
}

// Create singleton instance
const apiService = new ApiService();

module.exports = apiService;
