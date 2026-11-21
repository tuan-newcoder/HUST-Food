import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { User } from '@/types/user.types';
import { Post } from '@/types/post.types';

export interface FollowResult {
  targetUserId: string;
  isFollowing: boolean;
  followersCount: number;
}

export const userService = {
  /**
   * Lấy thông tin hồ sơ của chính mình (F03)
   */
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await axiosClient.get<ApiResponse<{ user: User }>>('/users/me');
    return response.data;
  },

  /**
   * Cập nhật thông tin hồ sơ cá nhân (F03)
   */
  async updateMe(payload: {
    fullName?: string;
    avatarUrl?: string;
    bio?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await axiosClient.put<ApiResponse<{ user: User }>>(
      '/users/me',
      payload
    );
    return response.data;
  },

  /**
   * Xem hồ sơ người dùng bất kỳ theo username (F03)
   */
  async getUserProfile(username: string): Promise<ApiResponse<{ user: User }>> {
    const response = await axiosClient.get<ApiResponse<{ user: User }>>(
      `/users/${username}`
    );
    return response.data;
  },

  /**
   * Lấy danh sách bài viết do người dùng đăng tải (F03)
   */
  async getUserPosts(
    username: string,
    params?: { postType?: string; cursor?: string; limit?: number }
  ): Promise<ApiResponse<Post[]>> {
    const response = await axiosClient.get<ApiResponse<Post[]>>(
      `/users/${username}/posts`,
      { params }
    );
    return response.data;
  },

  /**
   * Bật/tắt theo dõi một người dùng (F04)
   */
  async toggleFollow(targetUserId: string): Promise<ApiResponse<FollowResult>> {
    const response = await axiosClient.post<ApiResponse<FollowResult>>(
      `/users/${targetUserId}/follow`
    );
    return response.data;
  },

  /**
   * Lấy danh sách người đang theo dõi người dùng này (F04)
   */
  async getFollowers(
    userId: string,
    params?: { cursor?: string; limit?: number }
  ): Promise<ApiResponse<User[]>> {
    const response = await axiosClient.get<ApiResponse<User[]>>(
      `/users/${userId}/followers`,
      { params }
    );
    return response.data;
  },

  /**
   * Lấy danh sách người mà người dùng này đang theo dõi (F04)
   */
  async getFollowing(
    userId: string,
    params?: { cursor?: string; limit?: number }
  ): Promise<ApiResponse<User[]>> {
    const response = await axiosClient.get<ApiResponse<User[]>>(
      `/users/${userId}/following`,
      { params }
    );
    return response.data;
  },
};

