import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  year: string;
  department: string;
}

export interface AdminRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminSecret: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  studentId?: string;
  year?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  studentId?: string;
  year?: string;
  department?: string;
}

// Auth API Functions
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Store token if login successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Validate token
  validate: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.VALIDATE);
  },

  // Get token info
  getTokenInfo: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.TOKEN_INFO);
  },

  // Register user
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData);
    
    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Register admin
  adminRegister: async (adminData: AdminRegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
      ...adminData,
      isAdmin: true,
    });
    
    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  // Update user profile
  updateProfile: async (updates: UpdateProfileData): Promise<ApiResponse<User>> => {
    return apiService.put<User>(API_ENDPOINTS.AUTH.PROFILE, updates);
  },

  // Refresh authentication token
  refreshToken: async (): Promise<ApiResponse<{ token: string; refreshToken: string }>> => {
    const response = await apiService.post<{ token: string; refreshToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH
    );
    
    // Store new token if refresh successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Logout user
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiService.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    
    // Remove token regardless of response
    apiService.removeAuthToken();
    
    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return apiService['getAuthToken']() !== null;
  },
};