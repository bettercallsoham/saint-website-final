// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    // User auth endpoints
    USER_LOGIN: '/api/users/login',
    USER_REGISTER: '/api/users/register',
    USER_ME: '/api/users/me',
    USER_PROFILE: '/api/users/profile',
    USER_LOGOUT: '/api/users/logout',
    
    // Admin auth endpoints
    ADMIN_LOGIN: '/api/admin/auth/login',
    ADMIN_REGISTER: '/api/admin/auth/register',
    ADMIN_ME: '/api/admin/auth/me',
    ADMIN_PROFILE: '/api/admin/auth/profile',
    ADMIN_LOGOUT: '/api/admin/auth/logout',
    
    // Legacy endpoints (for backward compatibility during transition)
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    ME: '/api/users/me',
    PROFILE: '/api/users/profile',
    LOGOUT: '/api/users/logout',
  },
  EVENTS: {
    GET_ALL: '/api/events',
    GET_ONE: (id: string) => `/api/events/${id}`,
    CREATE: '/api/events',
    UPDATE: (id: string) => `/api/events/${id}`,
    DELETE: (id: string) => `/api/events/${id}`,
    RSVP: (id: string) => `/api/events/${id}/rsvp`,
    GET_RSVPS: (id: string) => `/api/events/${id}/rsvps`,
  },
  MEMBERS: {
    GET_ALL: '/api/members',
    GET_CORE_TEAM: '/api/members/core-team',
    GET_ONE: (id: string) => `/api/members/${id}`,
    CREATE: '/api/members',
    DELETE: (id: string) => `/api/members/${id}`,
  },
  CONTACT: {
    SUBMIT: '/api/contact',
  },
  GALLERY: {
    GET_ALL: '/api/gallery',
    GET_ONE: (id: string) => `/api/gallery/${id}`,
    CREATE: '/api/gallery',
    UPDATE: (id: string) => `/api/gallery/${id}`,
    DELETE: (id: string) => `/api/gallery/${id}`,
    UPLOAD: '/api/gallery/upload',
  },
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    STATS: '/api/admin/stats',
  },
  DATABASE: {
    STATUS: '/api/database/status',
    CONNECT: '/api/database/connect',
    DISCONNECT: '/api/database/disconnect',
    TEST: '/api/database/test',
  },
} as const;

export default API_CONFIG;