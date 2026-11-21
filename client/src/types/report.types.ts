export type ReportTargetType = 'POST' | 'REVIEW';
export type ReportReason = 'SPAM' | 'INAPPROPRIATE' | 'WRONG_INFO' | 'OTHER';
export type ReportStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

export interface CreateReportPayload {
  targetType: ReportTargetType;
  targetPostId?: string;
  targetReviewId?: string;
  reason: ReportReason;
  description?: string;
}

export interface Report {
  _id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetPostId?: string;
  targetReviewId?: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  resolvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

