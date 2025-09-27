import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Database Types
export interface DatabaseStatus {
  connected: boolean;
  status: string;
  message: string;
  timestamp: string;
}

export interface DatabaseTestResult {
  success: boolean;
  operations: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
  latency: number;
  timestamp: string;
}

// Database API Functions
export const databaseApi = {
  // Get database connection status
  getStatus: async (): Promise<ApiResponse<DatabaseStatus>> => {
    return apiService.get<DatabaseStatus>(API_ENDPOINTS.DATABASE.STATUS);
  },

  // Connect to database (Admin only)
  connect: async (): Promise<ApiResponse<DatabaseStatus>> => {
    return apiService.post<DatabaseStatus>(API_ENDPOINTS.DATABASE.CONNECT);
  },

  // Disconnect from database (Admin only)
  disconnect: async (): Promise<ApiResponse<DatabaseStatus>> => {
    return apiService.post<DatabaseStatus>(API_ENDPOINTS.DATABASE.DISCONNECT);
  },

  // Test database operations
  test: async (): Promise<ApiResponse<DatabaseTestResult>> => {
    return apiService.get<DatabaseTestResult>(API_ENDPOINTS.DATABASE.TEST);
  },
};