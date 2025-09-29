import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, User, LoginCredentials, RegisterData, AdminRegisterData, UpdateProfileData } from '../services';
import { toast } from 'sonner';

// Query Keys
export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'] as const,
} as const;

// Auth Hooks

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: async () => {
      const response = await authApi.getTokenInfo();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      return response.data;
    },
    enabled: authApi.isAuthenticated(),
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Validate current token
export const useValidateToken = () => {
  return useQuery({
    queryKey: ['auth', 'validate'],
    queryFn: async () => {
      const response = await authApi.validate();
      if (!response.success) {
        throw new Error(response.message || 'Token validation failed');
      }
      return response.data;
    },
    enabled: authApi.isAuthenticated(),
    retry: false,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.data?.user);
        toast.success('Login successful!');
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.data?.user);
        toast.success('Registration successful!');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

// Admin register mutation
export const useAdminRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminData: AdminRegisterData) => authApi.adminRegister(adminData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.data?.user);
        toast.success('Admin registration successful!');
      } else {
        toast.error(data.message || 'Admin registration failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Admin registration failed');
    },
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: UpdateProfileData) => authApi.updateProfile(updates),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.data);
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Profile update failed');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Profile update failed');
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.profile });
      queryClient.clear(); // Clear all cached data
      toast.success('Logged out successfully');
    },
    onError: (error: any) => {
      // Still clear cache even if logout request fails
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.profile });
      queryClient.clear();
      toast.error(error.message || 'Logout failed');
    },
  });
};