import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Member Types
export interface Member {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  role: string;
  position: string;
  designation?: string; // For core team members
  year: string;
  branch: string;
  studentId: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  phoneNumber?: string;
  joinedAt?: string;
  isActive: boolean;
  isCoreTeam?: boolean;
  displayOrder?: number;
}

// Members response type to match backend structure
export interface MembersResponse {
  members: Member[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateMemberData {
  name: string;
  email?: string;
  role: string;
  position: string;
  designation?: string;
  year: string;
  branch: string;
  studentId: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  phoneNumber?: string;
  isCoreTeam?: boolean;
  displayOrder?: number;
}

// Members API Functions
export const membersApi = {
  // Get all members
  getAll: async (): Promise<ApiResponse<MembersResponse>> => {
    return apiService.get<MembersResponse>(API_ENDPOINTS.MEMBERS.GET_ALL);
  },

  // Get core team members
  getCoreTeam: async (): Promise<ApiResponse<MembersResponse>> => {
    return apiService.get<MembersResponse>(`${API_ENDPOINTS.MEMBERS.GET_ALL}/core-team`);
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