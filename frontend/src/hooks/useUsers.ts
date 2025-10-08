import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, User } from '../services/usersApi';
import { toast } from 'sonner';

// Query Keys
export const USERS_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USERS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...USERS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...USERS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...USERS_QUERY_KEYS.details(), id] as const,
} as const;

// Users Hooks

// Get all users (admin only)
export const useUsers = () => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await usersApi.getAllUsers();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch users');
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: USERS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await usersApi.getUserById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Update user role mutation
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: 'user' | 'admin' }) =>
      usersApi.updateUserRole(id, role),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate users list
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
        // Update specific user cache
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(variables.id) });
        toast.success('User role updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update user role');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user role');
    },
  });
};

// Update user status mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersApi.updateUserStatus(id, isActive),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate users list
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
        // Update specific user cache
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.detail(variables.id) });
        toast.success(`User ${variables.isActive ? 'activated' : 'deactivated'} successfully!`);
      } else {
        toast.error(data.message || 'Failed to update user status');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: (data, id) => {
      if (data.success) {
        // Invalidate users list
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.lists() });
        // Remove specific user from cache
        queryClient.removeQueries({ queryKey: USERS_QUERY_KEYS.detail(id) });
        toast.success('User deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};