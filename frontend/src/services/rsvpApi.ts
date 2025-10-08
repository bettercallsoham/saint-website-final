import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface RSVP {
  id: string;
  userId: string;
  eventId: string;
  status: 'attending' | 'not_attending' | 'maybe';
  registrationDate: string;
  user?: {
    name: string;
    email: string;
    studentId?: string;
    department?: string;
    year?: string;
  };
  event?: {
    title: string;
    date: string;
    location: string;
  };
}

// RSVP API Functions
export const rsvpApi = {
  // Get all RSVPs for an event (admin only)
  getEventRSVPs: async (eventId: string): Promise<ApiResponse<RSVP[]>> => {
    return apiService.get<RSVP[]>(API_ENDPOINTS.RSVPS.GET_EVENT_RSVPS(eventId));
  },

  // Get user's RSVPs
  getUserRSVPs: async (): Promise<ApiResponse<RSVP[]>> => {
    return apiService.get<RSVP[]>(API_ENDPOINTS.RSVPS.GET_USER_RSVPS);
  },

  // Create or update RSVP
  createOrUpdateRSVP: async (eventId: string, status: 'attending' | 'not_attending' | 'maybe'): Promise<ApiResponse<RSVP>> => {
    return apiService.post<RSVP>(API_ENDPOINTS.RSVPS.CREATE_OR_UPDATE, {
      eventId,
      status
    });
  },

  // Delete RSVP
  deleteRSVP: async (eventId: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(API_ENDPOINTS.RSVPS.DELETE(eventId));
  },

  // Get all RSVPs (admin only)
  getAllRSVPs: async (): Promise<ApiResponse<RSVP[]>> => {
    return apiService.get<RSVP[]>(API_ENDPOINTS.RSVPS.GET_ALL);
  },
};