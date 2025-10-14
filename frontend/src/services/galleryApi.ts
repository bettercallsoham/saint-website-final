import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Gallery Types
export interface GalleryItem {
  _id: string;
  id?: string; // Keep for backward compatibility
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  images?: Array<{
    url: string;
    caption?: string;
    isPrimary?: boolean;
    metadata?: {
      width?: number;
      height?: number;
      size?: number;
      format?: string;
      originalName?: string;
    };
  }>;
  category: string;
  event?: string;
  eventId?: string;
  eventName?: string;
  date: string;
  photographer?: string;
  tags?: string[];
  likes: number;
  views: number;
  isActive?: boolean;
  isFeatured?: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryItemData {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  eventId?: string;
  eventName?: string;
  date: string;
  photographer?: string;
  tags?: string[];
}

// Gallery response types to match backend structure
export interface GalleryResponse {
  gallery: GalleryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Gallery API Functions
export const galleryApi = {
  // Get all gallery items
  getAll: async (): Promise<ApiResponse<GalleryResponse>> => {
    const response = await apiService.get<GalleryResponse>(API_ENDPOINTS.GALLERY.GET_ALL);
    
    // Transform _id to id for compatibility if needed
    if (response.success && response.data?.gallery) {
      response.data.gallery = response.data.gallery.map(item => ({
        ...item,
        id: item._id || item.id
      }));
    }
    
    return response;
  },

  // Get single gallery item by ID
  getById: async (id: string): Promise<ApiResponse<GalleryItem>> => {
    return apiService.get<GalleryItem>(API_ENDPOINTS.GALLERY.GET_ONE(id));
  },

  // Create new gallery item (Admin only)
  create: async (itemData: CreateGalleryItemData | FormData): Promise<ApiResponse<GalleryItem>> => {
    return apiService.post<GalleryItem>(API_ENDPOINTS.GALLERY.CREATE, itemData);
  },

  // Create gallery item with multiple images (Admin only)
  createMultiple: async (formData: FormData): Promise<ApiResponse<GalleryItem>> => {
    return apiService.post<GalleryItem>(`${API_ENDPOINTS.GALLERY.CREATE}/multiple`, formData);
  },

  // Update gallery item (Admin only)
  update: async (id: string, itemData: Partial<CreateGalleryItemData> | FormData): Promise<ApiResponse<GalleryItem>> => {
    return apiService.put<GalleryItem>(API_ENDPOINTS.GALLERY.UPDATE(id), itemData);
  },

  // Delete gallery item (Admin only)
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete<void>(API_ENDPOINTS.GALLERY.DELETE(id));
  },
};