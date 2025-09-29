import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi, Event, CreateEventData, UpdateEventData } from '../services';
import { toast } from 'sonner';

// Query Keys
export const EVENTS_QUERY_KEYS = {
  all: ['events'] as const,
  detail: (id: string) => ['events', id] as const,
} as const;

// Events Hooks

// Get all events
export const useEvents = () => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await eventsApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch events');
      }
      return response.data || [];
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single event
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: EVENTS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await eventsApi.getById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event');
      }
      return response.data;
    },
    enabled: !!id,
    retry: 3,
  });
};

// Create event mutation (Admin only)
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData: CreateEventData) => eventsApi.create(eventData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
        toast.success('Event created successfully!');
      } else {
        toast.error(data.message || 'Failed to create event');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event');
    },
  });
};

// Update event mutation (Admin only)
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateEventData }) =>
      eventsApi.update(id, updates),
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.detail(variables.id) });
        toast.success('Event updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update event');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event');
    },
  });
};

// Delete event mutation (Admin only)
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: (data, id) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEYS.all });
        queryClient.removeQueries({ queryKey: EVENTS_QUERY_KEYS.detail(id) });
        toast.success('Event deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete event');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete event');
    },
  });
};