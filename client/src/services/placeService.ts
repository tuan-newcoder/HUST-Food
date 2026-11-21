import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { MenuItem, OpeningHours, Place, PlaceCategory, PlaceLocation, PriceRange } from '@/types/place.types';
import { Review } from '@/types/review.types';

export interface PlaceListParams {
  q?: string;
  category?: 'ALL' | PlaceCategory;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'rating' | 'reviews' | 'newest';
  cursor?: string;
  limit?: number;
}

export interface CreatePlacePayload {
  name: string;
  category: PlaceCategory;
  address: string;
  coverImage: string;
  images?: string[];
  priceRange: PriceRange;
  openingHours?: OpeningHours;
  menu?: MenuItem[];
  location: PlaceLocation;
}

export const placeService = {
  /** Danh bạ quán ăn có lọc & phân trang (F06) */
  async getPlaces(params?: PlaceListParams): Promise<ApiResponse<Place[]>> {
    const response = await axiosClient.get<ApiResponse<Place[]>>('/places', { params });
    return response.data;
  },

  /** Chi tiết quán ăn (F07) */
  async getPlaceById(
    id: string
  ): Promise<ApiResponse<{ place: Place & { myReview: Review | null } }>> {
    const response = await axiosClient.get<ApiResponse<{ place: Place & { myReview: Review | null } }>>(
      `/places/${id}`
    );
    return response.data;
  },

  /** Đóng góp quán mới (F08) */
  async createPlace(payload: CreatePlacePayload): Promise<ApiResponse<{ place: Place }>> {
    const response = await axiosClient.post<ApiResponse<{ place: Place }>>('/places', payload);
    return response.data;
  },

  /** Cập nhật thông tin quán (F08) */
  async updatePlace(
    id: string,
    payload: Partial<CreatePlacePayload>
  ): Promise<ApiResponse<{ place: Place }>> {
    const response = await axiosClient.put<ApiResponse<{ place: Place }>>(`/places/${id}`, payload);
    return response.data;
  },
};
