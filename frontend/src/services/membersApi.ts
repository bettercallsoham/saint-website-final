import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Member Types
export interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
  year?: string;
  department?: string;
  studentId?: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface CreateMemberData {
  name: string;
  email: string;
  password: string;
  role?: string;
  year?: string;
  department?: string;
  studentId?: string;
  profileImage?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}

// Members API Functions
export const membersApi = {
  // Get all members (public - basic info)
  getAll: async (): Promise<ApiResponse<Member[]>> => {
    const response = await apiService.get<{
      success: boolean;
      count: number;
      total: number;
      currentPage: number;
      totalPages: number;
      members: Member[];
    }>(API_ENDPOINTS.MEMBERS.GET_ALL);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.members,
        message: response.message
      };
    }
    
    return {
      success: false,
      data: [],
      message: response.message || 'Failed to fetch members'
    };
  },

  // Get all members (admin - full details)
  getAllAdmin: async (): Promise<ApiResponse<Member[]>> => {
    const response = await apiService.get<{
      success: boolean;
      count: number;
      total: number;
      currentPage: number;
      totalPages: number;
      members: Member[];
    }>(API_ENDPOINTS.MEMBERS.GET_ALL_ADMIN);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.members,
        message: response.message
      };
    }
    
    return {
      success: false,
      data: [],
      message: response.message || 'Failed to fetch members'
    };
  },

  // Get single member by ID
  getById: async (id: string): Promise<ApiResponse<Member>> => {
    const response = await apiService.get<{
      success: boolean;
      member: Member;
    }>(API_ENDPOINTS.MEMBERS.GET_ONE(id));
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.member,
        message: response.message
      };
    }
    
    return {
      success: false,
      data: null as any,
      message: response.message || 'Failed to fetch member'
    };
  },

  // Create new member (Admin only)
  create: async (memberData: CreateMemberData): Promise<ApiResponse<Member>> => {
    return apiService.post<Member>(API_ENDPOINTS.MEMBERS.CREATE, memberData);
  },
};