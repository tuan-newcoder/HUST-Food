import axiosClient from './axiosClient';
import { ApiResponse } from '@/types/api.types';
import {
  AuthResponseData,
  LoginCredentials,
  RegisterPayload,
} from '@/types/user.types';

export const authService = {
  /**
   * Đăng ký tài khoản mới (F01)
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    const response = await axiosClient.post<ApiResponse<AuthResponseData>>(
      '/auth/register',
      payload
    );
    return response.data;
  },

  /**
   * Đăng nhập người dùng (F01)
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    const response = await axiosClient.post<ApiResponse<AuthResponseData>>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  /**
   * Làm mới Access Token (F01)
   */
  async refresh(refreshToken: string): Promise<
    ApiResponse<{ accessToken: string; refreshToken?: string }>
  > {
    const response = await axiosClient.post<
      ApiResponse<{ accessToken: string; refreshToken?: string }>
    >('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Đăng xuất & huỷ phiên (F01)
   */
  async logout(): Promise<ApiResponse<{ loggedOut: boolean }>> {
    const response = await axiosClient.post<ApiResponse<{ loggedOut: boolean }>>(
      '/auth/logout'
    );
    return response.data;
  },

  /**
   * Yêu cầu gửi mã OTP khôi phục mật khẩu qua Email (F02)
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    const response = await axiosClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      { email }
    );
    return response.data;
  },

  /**
   * Đặt lại mật khẩu mới bằng OTP (F02)
   */
  async resetPassword(payload: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<{ resetSuccess: boolean }>> {
    const response = await axiosClient.post<ApiResponse<{ resetSuccess: boolean }>>(
      '/auth/reset-password',
      payload
    );
    return response.data;
  },
};

