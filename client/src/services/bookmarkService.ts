import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import {
  Bookmark,
  ToggleBookmarkPayload,
  ToggleBookmarkResult,
} from '@/types/bookmark.types';

export const bookmarkService = {
  /**
   * Bật/tắt lưu quán ăn hoặc bài viết (F05)
   */
  async toggleBookmark(
    payload: ToggleBookmarkPayload
  ): Promise<ApiResponse<ToggleBookmarkResult>> {
    const response = await axiosClient.post<ApiResponse<ToggleBookmarkResult>>(
      '/bookmarks/toggle',
      payload
    );
    return response.data;
  },

  /**
   * Lấy danh sách mục đã lưu (F05)
   */
  async getBookmarks(params?: {
    type?: 'PLACE' | 'POST';
    cursor?: string;
    limit?: number;
  }): Promise<ApiResponse<Bookmark[]>> {
    const response = await axiosClient.get<ApiResponse<Bookmark[]>>('/bookmarks', {
      params,
    });
    return response.data;
  },
};

