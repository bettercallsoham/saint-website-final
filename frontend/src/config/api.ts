// API Configuration
const getBaseUrl = () => {
  // In development, use environment variable or default to localhost
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  
  // In production, use production URL
  return import.meta.env.VITE_API_URL || 'https://saint-data.vercel.app';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ADMIN_REGISTER: '/api/auth/admin/register',
    VALIDATE: '/api/auth/validate',
    TOKEN_INFO: '/api/auth/token-info',
    TOKEN: '/api/auth/token',
    ME: '/api/auth/me',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  EVENTS: {
    GET_ALL: '/api/events',
    GET_ONE: (id: string) => `/api/events/${id}`,
    CREATE: '/api/events',
    UPDATE: (id: string) => `/api/events/${id}`,
    DELETE: (id: string) => `/api/events/${id}`,
  },
  MEMBERS: {
    GET_ALL: '/api/members',
    GET_ALL_ADMIN: '/api/members/admin/all',
    GET_ONE: (id: string) => `/api/members/${id}`,
    CREATE: '/api/members',
  },
  CONTACT: {
    SUBMIT: '/api/contact',
  },
  GALLERY: {
    GET_ALL: '/api/gallery',
    GET_ONE: (id: string) => `/api/gallery/${id}`,
    CREATE: '/api/gallery',
  },
  USERS: {
    GET_ALL: '/api/auth/admin/users',
    GET_ONE: (id: string) => `/api/auth/admin/users/${id}`,
    UPDATE_ROLE: (id: string) => `/api/auth/admin/users/${id}/role`,
    UPDATE_STATUS: (id: string) => `/api/auth/admin/users/${id}/status`,
    DELETE: (id: string) => `/api/auth/admin/users/${id}`,
  },
  DATABASE: {
    STATUS: '/api/database/status',
    CONNECT: '/api/database/connect',
    DISCONNECT: '/api/database/disconnect',
    TEST: '/api/database/test',
  },
  RSVPS: {
    GET_ALL: '/api/rsvps',
    GET_EVENT_RSVPS: (eventId: string) => `/api/events/${eventId}/rsvps`,
    GET_USER_RSVPS: '/api/rsvps/user',
    CREATE_OR_UPDATE: '/api/rsvps',
    DELETE: (eventId: string) => `/api/rsvps/${eventId}`,
  },
} as const;

export default API_CONFIG;