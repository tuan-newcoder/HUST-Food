import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { AppNotification } from '@/types/notification.types';

export const notificationService = {
  /** Lịch sử thông báo có phân trang (F21, F22) */
  async getNotifications(params?: {
    cursor?: string;
    limit?: number;
  }): Promise<ApiResponse<AppNotification[]>> {
    const response = await axiosClient.get<ApiResponse<AppNotification[]>>('/notifications', {
      params,
    });
    return response.data;
  },

  /** Đánh dấu đã đọc 1 thông báo (F22) */
  async markAsRead(
    id: string
  ): Promise<ApiResponse<{ notificationId: string; isRead: true; unreadCount: number }>> {
    const response = await axiosClient.patch<
      ApiResponse<{ notificationId: string; isRead: true; unreadCount: number }>
    >(`/notifications/${id}/read`);
    return response.data;
  },

  /** Đánh dấu đọc tất cả (F22) */
  async markAllAsRead(): Promise<ApiResponse<{ unreadCount: 0; message: string }>> {
    const response = await axiosClient.patch<ApiResponse<{ unreadCount: 0; message: string }>>(
      '/notifications/read-all'
    );
    return response.data;
  },
};
