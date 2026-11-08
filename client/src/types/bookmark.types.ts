export type BookmarkTargetType = 'PLACE' | 'POST';

export interface Bookmark {
  _id: string;
  userId: string;
  targetType: BookmarkTargetType;
  placeId?: string;
  postId?: string;
  createdAt: string;
}

export interface ToggleBookmarkPayload {
  targetType: BookmarkTargetType;
  targetId: string;
}

export interface ToggleBookmarkResult {
  targetType: BookmarkTargetType;
  targetId: string;
  isBookmarked: boolean;
}

