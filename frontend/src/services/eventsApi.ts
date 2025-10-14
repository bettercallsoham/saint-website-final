import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  speaker?: {
    name?: string;
    designation?: string;
    bio?: string;
    image?: string;
  };
  category: 'workshop' | 'seminar' | 'competition' | 'social' | 'meeting' | 'other';
  maxAttendees?: number;
  registrationRequired: boolean;
  registrationDeadline?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags?: string[];
  images?: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
  rsvps: Array<{
    user: string;
    rsvpDate: string;
    status: 'confirmed' | 'tentative' | 'cancelled';
  }>;
  rsvpCount: number;
  spotsRemaining?: number;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  speaker?: {
    name?: string;
    designation?: string;
    bio?: string;
    image?: string;
  };
  category?: 'workshop' | 'seminar' | 'competition' | 'social' | 'meeting' | 'other';
  maxAttendees?: number;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  tags?: string[];
  images?: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
  }>;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface EventFilters {
  status?: string;
  category?: string;
  upcoming?: boolean;
  past?: boolean;
  limit?: number;
  page?: number;
}

// Events API Functions
export const eventsApi = {
  // Get all events with optional filters
  getAll: async (filters?: EventFilters): Promise<ApiResponse<{events: Event[], pagination: any}>> => {
    const queryParams = filters ? new URLSearchParams(Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)).toString() : '';
    
    const endpoint = queryParams ? `${API_ENDPOINTS.EVENTS.GET_ALL}?${queryParams}` : API_ENDPOINTS.EVENTS.GET_ALL;
    return apiService.get(endpoint);
  },

  // Get single event by ID
  getById: async (id: string): Promise<ApiResponse<{event: Event}>> => {
    return apiService.get(API_ENDPOINTS.EVENTS.GET_ONE(id));
  },

  // Create new event (Admin only)
  create: async (eventData: CreateEventData): Promise<ApiResponse<{event: Event}>> => {
    return apiService.post(API_ENDPOINTS.EVENTS.CREATE, eventData);
  },

  // Update event (Admin only)
  update: async (id: string, updates: UpdateEventData): Promise<ApiResponse<{event: Event}>> => {
    return apiService.put(API_ENDPOINTS.EVENTS.UPDATE(id), updates);
  },

  // Delete event (Admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete(API_ENDPOINTS.EVENTS.DELETE(id));
  },

  // RSVP to event
  rsvp: async (id: string): Promise<ApiResponse<{event: Event}>> => {
    return apiService.post(API_ENDPOINTS.EVENTS.RSVP(id));
  },

  // Cancel RSVP
  cancelRsvp: async (id: string): Promise<ApiResponse<{event: Event}>> => {
    return apiService.delete(API_ENDPOINTS.EVENTS.RSVP(id));
  },

  // Get event RSVPs (Admin only)
  getRsvps: async (id: string): Promise<ApiResponse<{eventTitle: string, totalRsvps: number, rsvps: any[]}>> => {
    return apiService.get(API_ENDPOINTS.EVENTS.GET_RSVPS(id));
  },
};