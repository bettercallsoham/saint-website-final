import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Event Types
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationStatus: 'open' | 'closed' | 'waitlist';
  price: number;
  isFree: boolean;
  requirements: string[];
  highlights: string[];
  tags: string[];
  images: string[];
  isFeatured: boolean;
  isActive: boolean;
  speaker?: {
    name: string;
    role: string;
    bio?: string;
    image?: string;
  };
  createdBy: string;
  registeredUsers: string[];
  waitlistUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  category: string;
  organizer: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// Events API Functions
export const eventsApi = {
  // Get all events
  getAll: async (): Promise<ApiResponse<Event[]>> => {
    const response = await apiService.get<{
      success: boolean;
      count: number;
      total: number;
      currentPage: number;
      totalPages: number;
      events: Event[];
    }>(API_ENDPOINTS.EVENTS.GET_ALL);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.events,
        message: response.message
      };
    }
    
    return {
      success: false,
      data: [],
      message: response.message || 'Failed to fetch events'
    };
  },

  // Get single event by ID
  getById: async (id: string): Promise<ApiResponse<Event>> => {
    return apiService.get<Event>(API_ENDPOINTS.EVENTS.GET_ONE(id));
  },

  // Create new event (Admin only)
  create: async (eventData: CreateEventData): Promise<ApiResponse<Event>> => {
    return apiService.post<Event>(API_ENDPOINTS.EVENTS.CREATE, eventData);
  },

  // Update event (Admin only)
  update: async (id: string, updates: UpdateEventData): Promise<ApiResponse<Event>> => {
    return apiService.put<Event>(API_ENDPOINTS.EVENTS.UPDATE(id), updates);
  },

  // Delete event (Admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(API_ENDPOINTS.EVENTS.DELETE(id));
  },
};