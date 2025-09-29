import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Contact Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  respondedAt?: string;
}

// Contact API Functions
export const contactApi = {
  // Submit contact form
  submit: async (formData: ContactFormData): Promise<ApiResponse<ContactResponse>> => {
    return apiService.post<ContactResponse>(API_ENDPOINTS.CONTACT.SUBMIT, formData);
  },
};