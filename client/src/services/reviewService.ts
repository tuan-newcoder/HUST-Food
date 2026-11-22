import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { PlaceRatings } from '@/types/place.types';
import { Review, ReviewPayload } from '@/types/review.types';

export interface UpdatedPlaceStats {
  averageRatings: PlaceRatings;
  totalReviews: number;
}

export const reviewService = {
  /** Danh sách đánh giá của quán, lọc theo sao / có ảnh (F10) */
  async getPlaceReviews(
    placeId: string,
    params?: { star?: 'ALL' | 1 | 2 | 3 | 4 | 5; hasImages?: boolean; cursor?: string; limit?: number }
  ): Promise<ApiResponse<Review[]>> {
    const response = await axiosClient.get<ApiResponse<Review[]>>(`/places/${placeId}/reviews`, {
      params,
    });
    return response.data;
  },

  /** Viết đánh giá 4 tiêu chí (F09) */
  async createReview(
    placeId: string,
    payload: ReviewPayload
  ): Promise<ApiResponse<{ review: Review; updatedPlaceStats: UpdatedPlaceStats }>> {
    const response = await axiosClient.post<
      ApiResponse<{ review: Review; updatedPlaceStats: UpdatedPlaceStats }>
    >(`/places/${placeId}/reviews`, payload);
    return response.data;
  },

  /** Sửa đánh giá (F10) */
  async updateReview(
    reviewId: string,
    payload: Partial<ReviewPayload>
  ): Promise<ApiResponse<{ review: Review; updatedPlaceStats: UpdatedPlaceStats }>> {
    const response = await axiosClient.put<
      ApiResponse<{ review: Review; updatedPlaceStats: UpdatedPlaceStats }>
    >(`/reviews/${reviewId}`, payload);
    return response.data;
  },

  /** Xóa đánh giá (F10) */
  async deleteReview(
    reviewId: string
  ): Promise<ApiResponse<{ deletedReviewId: string; updatedPlaceStats: UpdatedPlaceStats }>> {
    const response = await axiosClient.delete<
      ApiResponse<{ deletedReviewId: string; updatedPlaceStats: UpdatedPlaceStats }>
    >(`/reviews/${reviewId}`);
    return response.data;
  },
};
