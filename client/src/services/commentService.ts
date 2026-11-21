import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { Comment } from '@/types/comment.types';

export interface CreateCommentPayload {
  content: string;
  parentId?: string | null;
}

export interface CreateCommentResult {
  comment: Comment;
  postCommentsCount: number;
}

export interface DeleteCommentResult {
  deletedCommentId: string;
  postCommentsCount: number;
}

export const commentService = {
  /**
   * Lấy danh sách bình luận của bài viết (hỗ trợ phân tầng theo parentId) (F19)
   */
  async getComments(
    postId: string,
    params?: { parentId?: string | null; cursor?: string; limit?: number }
  ): Promise<ApiResponse<Comment[]>> {
    const response = await axiosClient.get<ApiResponse<Comment[]>>(
      `/posts/${postId}/comments`,
      { params }
    );
    return response.data;
  },

  /**
   * Viết bình luận gốc hoặc trả lời bình luận cấp 2 (F19)
   */
  async createComment(
    postId: string,
    payload: CreateCommentPayload
  ): Promise<ApiResponse<CreateCommentResult>> {
    const response = await axiosClient.post<ApiResponse<CreateCommentResult>>(
      `/posts/${postId}/comments`,
      payload
    );
    return response.data;
  },

  /**
   * Xóa bình luận của chính mình (F19)
   */
  async deleteComment(commentId: string): Promise<ApiResponse<DeleteCommentResult>> {
    const response = await axiosClient.delete<ApiResponse<DeleteCommentResult>>(
      `/comments/${commentId}`
    );
    return response.data;
  },
};

