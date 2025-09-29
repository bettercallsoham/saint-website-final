import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi, Member, CreateMemberData } from '../services';
import { toast } from 'sonner';

// Query Keys
export const MEMBERS_QUERY_KEYS = {
  all: ['members'] as const,
  detail: (id: string) => ['members', id] as const,
} as const;

// Members Hooks

// Get all members
export const useMembers = () => {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await membersApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch members');
      }
      return response.data || [];
    },
    retry: 3,
    staleTime: 10 * 60 * 1000, // 10 minutes (members data changes less frequently)
  });
};

// Get single member
export const useMember = (id: string) => {
  return useQuery({
    queryKey: MEMBERS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await membersApi.getById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch member');
      }
      return response.data;
    },
    enabled: !!id,
    retry: 3,
  });
};

// Create member mutation (Admin only)
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberData: CreateMemberData) => membersApi.create(memberData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: MEMBERS_QUERY_KEYS.all });
        toast.success('Member added successfully!');
      } else {
        toast.error(data.message || 'Failed to add member');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add member');
    },
  });
};