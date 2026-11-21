import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { Post, PostType, RecipeInfo, TrendingTag } from '@/types/post.types';

export interface CreatePostPayload {
  postType: PostType;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  placeId?: string | null;
  recipeInfo?: RecipeInfo;
}

export interface ToggleYummyResult {
  postId: string;
  isYummied: boolean;
  yummyCount: number;
}

export const postService = {
  /**
   * Tải ảnh lên Cloudinary qua Server (F08, F15)
   */
  async uploadImages(files: File[]): Promise<ApiResponse<{ urls: string[] }>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await axiosClient.post<ApiResponse<{ urls: string[] }>>(
      '/upload/images',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Lấy danh sách bài viết trên Bảng tin (Cursor Pagination) (F14)
   */
  async getFeed(params?: {
    postType?: 'ALL' | 'EXPERIENCE' | 'RECIPE';
    cursor?: string;
    limit?: number;
  }): Promise<ApiResponse<Post[]>> {
    const response = await axiosClient.get<ApiResponse<Post[]>>('/posts/feed', {
      params,
    });
    return response.data;
  },

  /**
   * Đăng bài viết chia sẻ Trải nghiệm hoặc Công thức nấu ăn mới (F15)
   */
  async createPost(payload: CreatePostPayload): Promise<ApiResponse<{ post: Post }>> {
    const response = await axiosClient.post<ApiResponse<{ post: Post }>>(
      '/posts',
      payload
    );
    return response.data;
  },

  /**
   * Lấy chi tiết một bài viết theo ID (F14, F15)
   */
  async getPostById(id: string): Promise<ApiResponse<{ post: Post }>> {
    const response = await axiosClient.get<ApiResponse<{ post: Post }>>(
      `/posts/${id}`
    );
    return response.data;
  },

  /**
   * Chỉnh sửa bài viết (F17)
   */
  async updatePost(
    id: string,
    payload: Partial<CreatePostPayload>
  ): Promise<ApiResponse<{ post: Post }>> {
    const response = await axiosClient.put<ApiResponse<{ post: Post }>>(
      `/posts/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Xóa bài viết (F17)
   */
  async deletePost(id: string): Promise<ApiResponse<{ deletedPostId: string }>> {
    const response = await axiosClient.delete<ApiResponse<{ deletedPostId: string }>>(
      `/posts/${id}`
    );
    return response.data;
  },

  /**
   * Tìm kiếm toàn văn bài viết theo từ khóa / thẻ tag (F16)
   */
  async searchPosts(params: {
    q?: string;
    postType?: 'ALL' | 'EXPERIENCE' | 'RECIPE';
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    tag?: string;
    cursor?: string;
    limit?: number;
  }): Promise<ApiResponse<Post[]>> {
    const response = await axiosClient.get<ApiResponse<Post[]>>('/posts/search', {
      params,
    });
    return response.data;
  },

  /**
   * Lấy danh sách #tags thịnh hành nhất trong tuần (F16)
   */
  async getTrendingTags(limit = 10): Promise<ApiResponse<TrendingTag[]>> {
    const response = await axiosClient.get<ApiResponse<TrendingTag[]>>(
      '/posts/tags/trending',
      {
        params: { limit },
      }
    );
    return response.data;
  },

  /**
   * Thả cảm xúc Yummy hoặc Bỏ thả (F18)
   */
  async toggleYummy(postId: string): Promise<ApiResponse<ToggleYummyResult>> {
    const response = await axiosClient.post<ApiResponse<ToggleYummyResult>>(
      `/posts/${postId}/yummy`
    );
    return response.data;
  },
};

