import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'user' | 'admin';
  studentId?: string;
  year?: string;
  department?: string;
  skills?: string[];
  profileImage?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Users API Functions
export const usersApi = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await apiService.get<{users: User[]}>(API_ENDPOINTS.USERS.GET_ALL);
    
    if (response.success && response.data?.users) {
      return {
        success: response.success,
        message: response.message,
        data: response.data.users
      };
    }
    
    return {
      success: false,
      message: response.message || 'Failed to fetch users',
      data: []
    };
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiService.get<User>(API_ENDPOINTS.USERS.GET_ONE(id));
  },

  // Update user role (admin only)
  updateUserRole: async (id: string, role: 'user' | 'admin'): Promise<ApiResponse<User>> => {
    return apiService.put<User>(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role });
  },

  // Update user status (admin only)
  updateUserStatus: async (id: string, isActive: boolean): Promise<ApiResponse<User>> => {
    return apiService.put<User>(API_ENDPOINTS.USERS.UPDATE_STATUS(id), { isActive });
  },

  // Delete user (admin only)
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
  },
};