// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://saint-data.vercel.app',
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
  DATABASE: {
    STATUS: '/api/database/status',
    CONNECT: '/api/database/connect',
    DISCONNECT: '/api/database/disconnect',
    TEST: '/api/database/test',
  },
} as const;

export default API_CONFIG;