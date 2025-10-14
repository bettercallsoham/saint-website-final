import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService, { ApiResponse } from '../services/apiService';
import { galleryApi } from '../services/galleryApi';
import { toast } from 'sonner';

// Admin API endpoints
const ADMIN_ENDPOINTS = {
  DASHBOARD: '/api/admin/dashboard',
  ANALYTICS: '/api/admin/analytics',
  ACTIVITY: '/api/admin/activity',
  USERS: '/api/admin/users',
  USER_BY_ID: (id: string) => `/api/admin/users/${id}`,
  UPDATE_USER_ROLE: (id: string) => `/api/admin/users/${id}/role`,
  DEACTIVATE_USER: (id: string) => `/api/admin/users/${id}`,
  REACTIVATE_USER: (id: string) => `/api/admin/users/${id}/reactivate`,
} as const;

// Types
export interface AdminDashboardData {
  overview: {
    totalMembers: number;
    totalEvents: number;
    totalGalleryItems: number;
    totalContacts: number;
    unreadContacts: number;
  };
  recentActivity: {
    recentEvents: any[];
    recentMembers: any[];
  };
  upcomingEvents: any[];
  charts: {
    monthlyMembers: any[];
    monthlyEvents: any[];
  };
}

export interface AdminUsersData {
  users: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query Keys
export const ADMIN_QUERY_KEYS = {
  dashboard: ['admin', 'dashboard'] as const,
  analytics: ['admin', 'analytics'] as const,
  activity: (days?: number) => ['admin', 'activity', days] as const,
  users: (filters?: any) => ['admin', 'users', filters] as const,
  user: (id: string) => ['admin', 'users', id] as const,
  events: (filters?: any) => ['admin', 'events', filters] as const,
  gallery: (filters?: any) => ['admin', 'gallery', filters] as const,
} as const;

// Dashboard Hooks
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.dashboard,
    queryFn: async (): Promise<ApiResponse<AdminDashboardData>> => {
      return apiService.get<AdminDashboardData>(ADMIN_ENDPOINTS.DASHBOARD);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminAnalytics = () => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.analytics,
    queryFn: async () => {
      return apiService.get(ADMIN_ENDPOINTS.ANALYTICS);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAdminActivity = (days: number = 30) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.activity(days),
    queryFn: async () => {
      return apiService.get(`${ADMIN_ENDPOINTS.ACTIVITY}?days=${days}`);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// User Management Hooks
export const useAdminUsers = (filters: { search?: string; role?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.users(filters),
    queryFn: async (): Promise<ApiResponse<AdminUsersData>> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      return apiService.get<AdminUsersData>(`${ADMIN_ENDPOINTS.USERS}${query}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAdminUser = (id: string) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.user(id),
    queryFn: async () => {
      return apiService.get(ADMIN_ENDPOINTS.USER_BY_ID(id));
    },
    enabled: !!id,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      return apiService.put(ADMIN_ENDPOINTS.UPDATE_USER_ROLE(id), { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiService.put(ADMIN_ENDPOINTS.USER_BY_ID(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.delete(ADMIN_ENDPOINTS.DEACTIVATE_USER(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate user');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.delete(`/api/admin/users/${id}/permanent`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      toast.success('User deleted permanently');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};

export const useReactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.post(ADMIN_ENDPOINTS.REACTIVATE_USER(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reactivate user');
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.post(`/api/admin/users/${id}/ban`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      toast.success('User banned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to ban user');
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.post(`/api/admin/users/${id}/unban`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      toast.success('User unbanned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unban user');
    },
  });
};

// Event Management Hooks
export const useAdminEvents = (filters: { category?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.events(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value.toString());
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      return apiService.get(`/api/events${query}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: any) => {
      return apiService.post('/api/events', eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiService.put(`/api/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiService.delete(`/api/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
};

// Gallery Management Hooks
export const useAdminGallery = (filters: { category?: string; page?: number; limit?: number } = {}) => {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.gallery(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') params.append(key, value.toString());
      });
      const query = params.toString() ? `?${params.toString()}` : '';
      return apiService.get(`/api/gallery${query}`);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (galleryData: any) => {
      return galleryApi.create(galleryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create gallery item');
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return galleryApi.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update gallery item');
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return galleryApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'gallery'] });
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete gallery item');
    },
  });
};