import { create } from 'zustand';
import { Place, PlaceRatings } from '@/types/place.types';
import { Review, ReviewPayload } from '@/types/review.types';
import { User } from '@/types/user.types';
import { INITIAL_PLACES, INITIAL_REVIEWS } from './mockPlaceData';
import { computeOverall } from './placeUtils';

/**
 * Store tạm thời cho Quán ăn & Đánh giá trong lúc Backend chưa có route.
 * Khi API sẵn sàng, thay phần thân các action bằng placeService / reviewService.
 */
interface PlaceState {
  places: Place[];
  reviews: Record<string, Review[]>;
  addPlace: (place: Place) => void;
  toggleBookmark: (placeId: string) => boolean;
  saveReview: (placeId: string, payload: ReviewPayload, author: User, reviewId?: string) => Review;
  deleteReview: (placeId: string, reviewId: string) => void;
}

/**
 * Dữ liệu mẫu có totalReviews "lịch sử" (VD 124) lớn hơn số review mẫu đang hiển thị (3).
 * Lưu phần chênh lệch để tổng số review vẫn đúng khi người dùng thêm / xóa đánh giá.
 */
const HIDDEN_REVIEW_COUNT: Record<string, number> = Object.fromEntries(
  INITIAL_PLACES.map((p) => [
    p._id,
    Math.max((p.totalReviews ?? 0) - (INITIAL_REVIEWS[p._id]?.length ?? 0), 0),
  ])
);

/** Tính lại điểm trung bình của quán (tương đương recalculatePlaceRatings ở server) */
function recalc(placeId: string, list: Review[]): Pick<Place, 'averageRatings' | 'totalReviews'> {
  const hidden = HIDDEN_REVIEW_COUNT[placeId] ?? 0;
  if (list.length === 0) {
    return {
      averageRatings: { taste: 0, price: 0, hygiene: 0, service: 0, overall: 0 },
      totalReviews: hidden,
    };
  }
  const avg = (k: keyof PlaceRatings) =>
    Math.round((list.reduce((s, r) => s + r.ratings[k], 0) / list.length) * 10) / 10;
  return {
    averageRatings: {
      taste: avg('taste'),
      price: avg('price'),
      hygiene: avg('hygiene'),
      service: avg('service'),
      overall: avg('overall'),
    },
    totalReviews: hidden + list.length,
  };
}

export const usePlaceStore = create<PlaceState>((set, get) => ({
  places: INITIAL_PLACES,
  reviews: INITIAL_REVIEWS,

  addPlace: (place) =>
    set((s) => ({ places: [place, ...s.places], reviews: { ...s.reviews, [place._id]: [] } })),

  toggleBookmark: (placeId) => {
    const next = !get().places.find((p) => p._id === placeId)?.isBookmarked;
    set((s) => ({
      places: s.places.map((p) =>
        p._id === placeId
          ? {
              ...p,
              isBookmarked: next,
              bookmarksCount: Math.max((p.bookmarksCount ?? 0) + (next ? 1 : -1), 0),
            }
          : p
      ),
    }));
    return next;
  },

  saveReview: (placeId, payload, author, reviewId) => {
    const existing = get().reviews[placeId] ?? [];
    const previous = existing.find((r) => r._id === reviewId);
    const review: Review = {
      _id: previous?._id ?? `rv_${Date.now()}`,
      placeId,
      ratings: { ...payload.ratings, overall: computeOverall(payload.ratings) },
      content: payload.content,
      images: payload.images ?? [],
      author: {
        _id: author._id,
        username: author.username,
        fullName: author.fullName,
        avatarUrl: author.avatarUrl,
      },
      createdAt: previous?.createdAt ?? new Date().toISOString(),
      updatedAt: previous ? new Date().toISOString() : undefined,
    };
    const list = previous
      ? existing.map((r) => (r._id === previous._id ? review : r))
      : [review, ...existing];
    set((s) => ({
      reviews: { ...s.reviews, [placeId]: list },
      places: s.places.map((p) => (p._id === placeId ? { ...p, ...recalc(placeId, list) } : p)),
    }));
    return review;
  },

  deleteReview: (placeId, reviewId) => {
    const list = (get().reviews[placeId] ?? []).filter((r) => r._id !== reviewId);
    set((s) => ({
      reviews: { ...s.reviews, [placeId]: list },
      places: s.places.map((p) => (p._id === placeId ? { ...p, ...recalc(placeId, list) } : p)),
    }));
  },
}));
