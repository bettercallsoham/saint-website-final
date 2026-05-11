import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import localGalleryImages from 'virtual:gallery-images';
import { CreateGalleryItemData, galleryApi, GalleryItem } from '../services';

// Query Keys
export const GALLERY_QUERY_KEYS = {
  all: ['gallery'] as const,
  detail: (id: string) => ['gallery', id] as const,
} as const;

const formatGalleryTitle = (name: string) => {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const LOCAL_GALLERY_METADATA: Record<
  string,
  {
    title: string;
    date: string;
    description: string;
    category?: string;
    photographer?: string;
    tags?: string[];
    isFeatured?: boolean;
  }
> = {
    '20250905_142512': {
      title: 'Teachers Day 2025',
      date: '2025-05-09T00:00:00.000Z',
      description: 'Teachers Day celebration.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    '20250905_142722': {
      title: 'Teachers Day 2025',
      date: '2025-05-09T00:00:00.000Z',
      description: 'Teachers Day celebration.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    '20250905_163558': {
      title: 'Teachers Day 2025',
      date: '2025-05-09T00:00:00.000Z',
      description: 'Teachers Day celebration.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    '20260202_132016': {
      title: 'INNOVISION 2026',
      date: '2026-02-02T00:00:00.000Z',
      description: 'Prakalp project presentation competition.',
      category: 'event',
      photographer: 'SAINT',
      tags: [],
    },
    'IMG_20250409_195121': {
      title: 'UDAAN Farewell Fest 2025',
      date: '2025-08-30T00:00:00.000Z',
      description: 'Farewell of 2025 batch.',
      category: 'event',
      photographer: 'SAINT',
      tags: [],
    },
    'IMG_20250409_195707': {
      title: 'UDAAN Farewell Fest 2025',
      date: '2025-08-30T19:57:07.000Z',
      description: 'Farewell of 2025 batch.',
      category: 'event',
      photographer: 'SAINT',
      tags: ['farewell'],
    },
    'IMG_20250409_211922': {
      title: 'UDDAN Farewell Fest 2025',
      date: '2025-08-30T00:00:00.000Z',
      description: 'Farewell of 2025 batch.',
      category: 'event',
      photographer: 'SAINT',
      tags: [],
    },
    'IMG_20260328_124744': {
      title: 'Kautuk Sohala',
      date: '2026-03-28T00:00:00.000Z',
      description: 'Achivers of the year.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    'IMG_20260328_124856': {
      title: 'Kautuk Sohala',
      date: '2026-03-28T00:00:00.000Z',
      description: 'Achivers of the year.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    'IMG_20260328_125221': {
      title: 'Kautuk Sohala',
      date: '2026-03-28T00:00:00.000Z',
      description: 'Achivers of the year.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    'IMG_20260328_130429': {
      title: 'Kautuk Sohala',
      date: '2026-03-28T00:00:00.000Z',
      description: 'Parents - Teacher Meet.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    IMG_7333: {
      title: 'Prakalp 2026',
      date: '2026-02-02T00:00:00.000Z',
      description: 'Update this description.',
      category: 'event',
      photographer: 'SAINT',
      tags: [],
    },
    'PXL_20250808_104154841': {
      title: 'Tree Plantation 2025',
      date: '2025-09-13T00:00:00.000Z',
      description: 'Update this description.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    'PXL_20250808_104247630': {
      title: 'Tree Plantation 2025',
      date: '2025-09-13T00:00:00.000Z',
      description: 'Update this description.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
    'PXL_20250808_105554883.PORTRAIT': {
      title: 'Tree Plantation 2025',
      date: '2025-09-13T00:00:00.000Z',
      description: 'Update this description.',
      category: 'other',
      photographer: 'SAINT',
      tags: [],
    },
};

const getLocalGalleryMetadata = (imageName: string) => {
  return LOCAL_GALLERY_METADATA[imageName] || null;
};

const buildLocalGalleryItems = (): GalleryItem[] => {
  return localGalleryImages.map((image, index) => {
    const timestamp = image.modifiedAt || new Date().toISOString();
    const metadata = getLocalGalleryMetadata(image.name);

    return {
      _id: `local-gallery-${index}-${image.name}`,
      id: `local-gallery-${index}-${image.name}`,
      title: metadata?.title || formatGalleryTitle(image.name),
      description: metadata?.description || 'Local gallery image from frontend/public/images/gallery',
      imageUrl: image.url,
      thumbnailUrl: image.url,
      category: metadata?.category || 'other',
      date: metadata?.date || timestamp,
      photographer: metadata?.photographer || 'SAINT',
      tags: metadata?.tags || [],
      likes: 0,
      views: 0,
      isActive: true,
      isFeatured: metadata?.isFeatured || false,
      uploadedBy: 'local',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  });
};

const resolveGalleryItems = (items: GalleryItem[]) => {
  return [...items, ...buildLocalGalleryItems()].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
  );
};

// Gallery Hooks

// Get all gallery items
export const useGallery = () => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.all,
    queryFn: async () => {
      let galleryItems: GalleryItem[] = [];

      try {
        const response = await galleryApi.getAll();
        if (response.success) {
          // Extract the gallery array from the nested response structure
          // Backend returns { data: { gallery: [...], pagination: {...} } }
          const galleryData = response.data?.gallery || [];
          galleryItems = Array.isArray(galleryData) ? galleryData : [];
        }
      } catch (error) {
        console.warn('Falling back to local gallery images:', error);
      }

      return resolveGalleryItems(galleryItems);
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
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add gallery item');
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
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add gallery item with multiple images');
    },
  });
};