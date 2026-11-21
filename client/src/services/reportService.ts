import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import { CreateReportPayload, Report } from '@/types/report.types';

export const reportService = {
  /**
   * Gửi báo cáo vi phạm bài viết hoặc đánh giá (F20)
   */
  async createReport(payload: CreateReportPayload): Promise<ApiResponse<{ report: Report }>> {
    const response = await axiosClient.post<ApiResponse<{ report: Report }>>(
      '/reports',
      payload
    );
    return response.data;
  },
};

