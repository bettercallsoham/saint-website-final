import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi, GalleryItem, CreateGalleryItemData, GalleryResponse } from '../services';
import { toast } from 'sonner';

// Query Keys
export const GALLERY_QUERY_KEYS = {
  all: ['gallery'] as const,
  detail: (id: string) => ['gallery', id] as const,
} as const;

// Gallery Hooks

// Get all gallery items
export const useGallery = () => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.all,
    queryFn: async () => {
      const response = await galleryApi.getAll();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch gallery items');
      }
      // Extract the gallery array from the nested response structure
      // Backend returns { data: { gallery: [...], pagination: {...} } }
      const galleryData = response.data?.gallery || [];
      // Ensure we return an array
      return Array.isArray(galleryData) ? galleryData : [];
    },
    retry: 3,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single gallery item
export const useGalleryItem = (id: string) => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await galleryApi.getById(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch gallery item');
      }
      return response.data;
    },
    enabled: !!id,
    retry: 3,
  });
};

// Create gallery item mutation (Admin only)
export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData: CreateGalleryItemData) => galleryApi.create(itemData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
        toast.success('Gallery item added successfully!');
      } else {
        toast.error(data.message || 'Failed to add gallery item');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add gallery item');
    },
  });
};

// Create gallery item with multiple images mutation (Admin only)
export const useCreateGalleryItemMultiple = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => galleryApi.createMultiple(formData),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
        toast.success('Gallery item with multiple images added successfully!');
      } else {
        toast.error(data.message || 'Failed to add gallery item with multiple images');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add gallery item with multiple images');
    },
  });
};