import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rsvpApi, RSVP } from '@/services/rsvpApi';
import { toast } from 'sonner';

// Query Keys
export const RSVP_QUERY_KEYS = {
  all: ['rsvps'] as const,
  lists: () => [...RSVP_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...RSVP_QUERY_KEYS.lists(), filters] as const,
  userRsvps: () => [...RSVP_QUERY_KEYS.all, 'user'] as const,
  eventRsvps: (eventId: string) => [...RSVP_QUERY_KEYS.all, 'event', eventId] as const,
} as const;

// Get all RSVPs (admin only)
export const useAllRSVPs = () => {
  return useQuery({
    queryKey: RSVP_QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await rsvpApi.getAllRSVPs();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch RSVPs');
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Get RSVPs for a specific event
export const useEventRSVPs = (eventId: string) => {
  return useQuery({
    queryKey: RSVP_QUERY_KEYS.eventRsvps(eventId),
    queryFn: async () => {
      const response = await rsvpApi.getEventRSVPs(eventId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event RSVPs');
      }
      return response.data || [];
    },
    enabled: !!eventId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Get current user's RSVPs
export const useUserRSVPs = () => {
  return useQuery({
    queryKey: RSVP_QUERY_KEYS.userRsvps(),
    queryFn: async () => {
      const response = await rsvpApi.getUserRSVPs();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user RSVPs');
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Create or update RSVP
export const useCreateOrUpdateRSVP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, status }: { eventId: string; status: 'attending' | 'not_attending' | 'maybe' }) =>
      rsvpApi.createOrUpdateRSVP(eventId, status),
    onSuccess: (data, variables) => {
      if (data.success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: RSVP_QUERY_KEYS.userRsvps() });
        queryClient.invalidateQueries({ queryKey: RSVP_QUERY_KEYS.eventRsvps(variables.eventId) });
        queryClient.invalidateQueries({ queryKey: RSVP_QUERY_KEYS.lists() });
        
        const statusText = variables.status === 'attending' ? 'registered for' : 
                          variables.status === 'not_attending' ? 'declined' : 
                          'marked as maybe for';
        toast.success(`Successfully ${statusText} the event!`);
      } else {
        toast.error(data.message || 'Failed to update RSVP');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update RSVP');
    },
  });
};

// Delete RSVP
export const useDeleteRSVP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => rsvpApi.deleteRSVP(eventId),
    onSuccess: (data, eventId) => {
      if (data.success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: RSVP_QUERY_KEYS.userRsvps() });
        queryClient.invalidateQueries({ queryKey: RSVP_QUERY_KEYS.eventRsvps(eventId) });
        queryClient.invalidateQueries({ queryKey: RSVP_QUERY_KEYS.lists() });
        toast.success('RSVP cancelled successfully!');
      } else {
        toast.error(data.message || 'Failed to cancel RSVP');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel RSVP');
    },
  });
};