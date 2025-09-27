import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  registrationRequired: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  category: string;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
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
    return apiService.get<Event[]>(API_ENDPOINTS.EVENTS.GET_ALL);
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