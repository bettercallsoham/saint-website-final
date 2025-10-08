import { useQuery } from '@tanstack/react-query';
import { membersApi, eventsApi } from '../services';

// Hook to get member count
export const useMemberCount = () => {
  return useQuery({
    queryKey: ['stats', 'members', 'count'],
    queryFn: async () => {
      const response = await membersApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch member count');
      }
      return response.data?.length || 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get event count
export const useEventCount = () => {
  return useQuery({
    queryKey: ['stats', 'events', 'count'],
    queryFn: async () => {
      const response = await eventsApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch event count');
      }
      return response.data?.length || 0;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get upcoming events count
export const useUpcomingEventCount = () => {
  return useQuery({
    queryKey: ['stats', 'events', 'upcoming'],
    queryFn: async () => {
      const response = await eventsApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch upcoming events');
      }
      
      const now = new Date();
      const upcomingEvents = response.data?.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now;
      }) || [];
      
      return upcomingEvents.length;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get featured/latest event
export const useFeaturedEvent = () => {
  return useQuery({
    queryKey: ['stats', 'events', 'featured'],
    queryFn: async () => {
      const response = await eventsApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch featured event');
      }
      
      const events = response.data || [];
      if (events.length === 0) return null;
      
      // Get the most recent upcoming event, or latest event if no upcoming ones
      const now = new Date();
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now;
      });
      
      if (upcomingEvents.length > 0) {
        // Sort by date ascending (closest upcoming event first)
        upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return upcomingEvents[0];
      } else {
        // No upcoming events, return the latest past event
        events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return events[0];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Hook to get general statistics
export const useGeneralStats = () => {
  return useQuery({
    queryKey: ['stats', 'general'],
    queryFn: async () => {
      try {
        const [membersResponse, eventsResponse] = await Promise.all([
          membersApi.getAll(),
          eventsApi.getAll(),
        ]);

        const memberCount = membersResponse.success ? (membersResponse.data?.length || 0) : 0;
        const totalEvents = eventsResponse.success ? (eventsResponse.data?.length || 0) : 0;
        
        const now = new Date();
        const upcomingEvents = eventsResponse.success 
          ? (eventsResponse.data?.filter(event => new Date(event.date) > now).length || 0)
          : 0;

        return {
          memberCount,
          totalEvents,
          upcomingEvents,
        };
      } catch (error) {
        throw new Error('Failed to fetch general statistics');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};