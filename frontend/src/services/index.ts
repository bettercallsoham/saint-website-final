// API Services Export
export { default as apiService } from './apiService';
export type { ApiResponse, ApiError } from './apiService';

// Authentication API
export { authApi } from './authApi';
export type {
  LoginCredentials,
  RegisterData,
  AdminRegisterData,
  User,
  AuthResponse,
  UpdateProfileData,
} from './authApi';

// Events API
export { eventsApi } from './eventsApi';
export type {
  Event,
  CreateEventData,
  UpdateEventData,
} from './eventsApi';

// Members API
export { membersApi } from './membersApi';
export type {
  Member,
  CreateMemberData,
} from './membersApi';

// Contact API
export { contactApi } from './contactApi';
export type {
  ContactFormData,
  ContactResponse,
} from './contactApi';

// Gallery API
export { galleryApi } from './galleryApi';
export type {
  GalleryItem,
  CreateGalleryItemData,
} from './galleryApi';

// Users API
export { usersApi } from './usersApi';
export type { User as UserProfile } from './usersApi';

// RSVP API
export { rsvpApi } from './rsvpApi';
export type { RSVP } from './rsvpApi';

// Database API
export { databaseApi } from './databaseApi';
export type {
  DatabaseStatus,
  DatabaseTestResult,
} from './databaseApi';

// Import all APIs for combined export
import { authApi } from './authApi';
import { eventsApi } from './eventsApi';
import { membersApi } from './membersApi';
import { contactApi } from './contactApi';
import { galleryApi } from './galleryApi';
import { usersApi } from './usersApi';
import { rsvpApi } from './rsvpApi';
import { databaseApi } from './databaseApi';

// Combined API object for convenience
export const api = {
  auth: authApi,
  events: eventsApi,
  members: membersApi,
  contact: contactApi,
  gallery: galleryApi,
  users: usersApi,
  rsvp: rsvpApi,
  database: databaseApi,
};