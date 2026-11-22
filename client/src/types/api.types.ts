export interface PaginationMeta {
  nextCursor?: string | null;
  hasMore: boolean;
  unreadCount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: string[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

