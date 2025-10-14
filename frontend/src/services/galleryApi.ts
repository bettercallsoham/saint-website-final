import apiService, { ApiResponse } from './apiService';
import { API_ENDPOINTS } from '../config/api';

// Gallery Types
export interface GalleryItem {
  id: string;
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
  likes: number;
  views: number;
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
    return apiService.get<GalleryResponse>(API_ENDPOINTS.GALLERY.GET_ALL);
  },

  // Get single gallery item by ID
  getById: async (id: string): Promise<ApiResponse<GalleryItem>> => {
    return apiService.get<GalleryItem>(API_ENDPOINTS.GALLERY.GET_ONE(id));
  },

  // Create new gallery item (Admin only)
  create: async (itemData: CreateGalleryItemData | FormData): Promise<ApiResponse<GalleryItem>> => {
    return apiService.post<GalleryItem>(API_ENDPOINTS.GALLERY.CREATE, itemData);
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