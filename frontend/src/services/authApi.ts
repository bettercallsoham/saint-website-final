import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Helper functions for data transformation
const mapYearToBackend = (year: string): string => {
  const yearMap: { [key: string]: string } = {
    '1': '1st',
    '2': '2nd',
    '3': '3rd',
    '4': '4th',
    'Graduate': 'Graduate',
    'Alumni': 'Alumni',
  };
  return yearMap[year] || year;
};

const mapDepartmentToBackend = (department: string): string => {
  const departmentMap: { [key: string]: string } = {
    'IT': 'Information Technology',
    'CS': 'Computer Science',
    'ECE': 'Electronics',
    'MECH': 'Mechanical',
    'CIVIL': 'Civil',
    'Information Technology': 'Information Technology',
    'Computer Science': 'Computer Science',
    'Electronics': 'Electronics',
    'Mechanical': 'Mechanical',
    'Civil': 'Civil',
    'Other': 'Other',
  };
  return departmentMap[department] || 'Other';
};

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
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminSecret: string;
}

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
    // Transform data to match backend expectations
    const transformedData = {
      name: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      password: userData.password,
      studentId: userData.studentId,
      year: mapYearToBackend(userData.year),
      department: mapDepartmentToBackend(userData.department),
    };

    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, transformedData);
    
    // Store token if registration successful
    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Register admin
  adminRegister: async (adminData: AdminRegisterData): Promise<ApiResponse<AuthResponse>> => {
    // Transform data to match backend expectations
    const transformedData = {
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      secretKey: adminData.adminSecret
    };

    const response = await apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.ADMIN_REGISTER, transformedData);
    
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
    const token = localStorage.getItem('auth_token');
    return token !== null && token !== '';
  },
};