import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Member Types
export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  year: string;
  branch: string;
  studentId: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface CreateMemberData {
  name: string;
  email: string;
  role: string;
  position: string;
  year: string;
  branch: string;
  studentId: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

// Members API Functions
export const membersApi = {
  // Get all members
  getAll: async (): Promise<ApiResponse<Member[]>> => {
    return apiService.get<Member[]>(API_ENDPOINTS.MEMBERS.GET_ALL);
  },

  // Get single member by ID
  getById: async (id: string): Promise<ApiResponse<Member>> => {
    return apiService.get<Member>(API_ENDPOINTS.MEMBERS.GET_ONE(id));
  },

  // Create new member (Admin only)
  create: async (memberData: CreateMemberData): Promise<ApiResponse<Member>> => {
    return apiService.post<Member>(API_ENDPOINTS.MEMBERS.CREATE, memberData);
  },
};