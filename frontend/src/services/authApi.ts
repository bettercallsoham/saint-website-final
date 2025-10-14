import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  studentId?: string;
  year?: string;
  department?: string;
}

export interface AdminRegisterData {
  name: string;
  email: string;
  password: string;
  adminCode: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  studentId?: string;
  year?: string;
  department?: string;
  isActive: boolean;
  joinedAt: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  name?: string;
  phoneNumber?: string;
  studentId?: string;
  year?: string;
  department?: string;
}

// Auth API Functions
export const authApi = {
  // Login user (regular user)
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.USER_LOGIN, credentials);
    
    // Store token if login successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
      // Store user data in localStorage for easy access
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Login admin
  adminLogin: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
    
    // Store token if login successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
      // Store user data in localStorage for easy access
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Register user
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.USER_REGISTER, userData);
    
    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Register admin
  adminRegister: async (adminData: AdminRegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN_REGISTER, adminData);
    
    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const user = authApi.getCurrentUser();
    const endpoint = user?.role === 'admin' ? API_ENDPOINTS.AUTH.ADMIN_ME : API_ENDPOINTS.AUTH.USER_ME;
    return apiService.get<User>(endpoint);
  },

  // Update user profile
  updateProfile: async (updates: UpdateProfileData): Promise<ApiResponse<User>> => {
    const user = authApi.getCurrentUser();
    const endpoint = user?.role === 'admin' ? API_ENDPOINTS.AUTH.ADMIN_PROFILE : API_ENDPOINTS.AUTH.USER_PROFILE;
    const response = await apiService.put<User>(endpoint, updates);
    
    // Update stored user data if successful
    if (response.success && response.data) {
      localStorage.setItem('user_data', JSON.stringify(response.data));
    }
    
    return response;
  },

  // Logout user
  logout: async (): Promise<ApiResponse<void>> => {
    try {
      const user = authApi.getCurrentUser();
      const endpoint = user?.role === 'admin' ? API_ENDPOINTS.AUTH.ADMIN_LOGOUT : API_ENDPOINTS.AUTH.USER_LOGOUT;
      const response = await apiService.post<void>(endpoint);
      
      // Remove token and user data regardless of response
      apiService.removeAuthToken();
      localStorage.removeItem('user_data');
      
      return response;
    } catch (error) {
      // If API call fails (invalid token, etc.), still clear local storage
      apiService.removeAuthToken();
      localStorage.removeItem('user_data');
      
      // Return a success response since we've cleared the local state
      return {
        success: true,
        message: 'Logged out locally',
        data: undefined
      };
    }
  },

  // Force logout (clears local storage without API call)
  forceLogout: (): void => {
    apiService.removeAuthToken();
    localStorage.removeItem('user_data');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem('auth_token') !== null;
  },

  // Get stored user data
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    const user = authApi.getCurrentUser();
    return user?.role === 'admin';
  },

  // Debug function to clear all auth state
  clearAuthState: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    console.log('Auth state cleared successfully');
  },
};