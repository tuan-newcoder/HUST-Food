import React, { useMemo, useState } from 'react';
import { ArrowLeft, Bookmark, Clock, MapPin, Navigation, Share2, Star } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { toast } from '@/components/feedback/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { Review, ReviewPayload } from '@/types/review.types';
import { cn } from '@/utils/cn';
import { RatingSummary } from '@/features/reviews/components/RatingSummary';
import { ReviewCard } from '@/features/reviews/components/ReviewCard';
import { ReviewFormModal } from '@/features/reviews/components/ReviewFormModal';
import { PlaceMiniMap } from '../components/PlaceMiniMap';
import { usePlaceStore } from '../usePlaceStore';
import { CATEGORY_LABELS, formatPriceRange, isOpenNow } from '../placeUtils';

interface PlaceDetailPageProps {
  placeId: string;
  onBack: () => void;
  onOpenMap: () => void;
  onRequireAuth?: () => void;
}

type StarFilter = 'ALL' | 1 | 2 | 3 | 4 | 5;
const REVIEWS_PAGE = 5;

export const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({ placeId, onBack, onOpenMap, onRequireAuth }) => {
  const place = usePlaceStore((s) => s.places.find((p) => p._id === placeId));
  const reviews = usePlaceStore((s) => s.reviews[placeId]) ?? [];
  const { toggleBookmark, saveReview, deleteReview } = usePlaceStore();
  const { user, isAuthenticated } = useAuthStore();

  const [starFilter, setStarFilter] = useState<StarFilter>('ALL');
  const [onlyPhotos, setOnlyPhotos] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PAGE);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Review | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const myReview = useMemo(
    () => (user ? reviews.find((r) => r.author._id === user._id) ?? null : null),
    [reviews, user]
  );

  const filteredReviews = useMemo(
    () =>
      reviews.filter((r) => {
        if (starFilter !== 'ALL' && Math.round(r.ratings.overall) !== starFilter) return false;
        if (onlyPhotos && r.images.length === 0) return false;
        return true;
      }),
    [reviews, starFilter, onlyPhotos]
  );

  if (!place) {
    return (
      <EmptyState
        icon="search"
        title="Không tìm thấy quán ăn"
        description="Quán có thể đã bị xóa hoặc đường dẫn không đúng."
        actionLabel="Về danh bạ quán"
        onAction={onBack}
      />
    );
  }

  const open = isOpenNow(place.openingHours);
  const gallery = place.images?.length ? place.images : [place.coverImage];
  const [lng, lat] = place.location?.coordinates ?? [105.8431, 21.0055];

  const requireAuth = (message: string) => {
    if (isAuthenticated && user) return true;
    toast.warning(message, 'Yêu cầu đăng nhập');
    onRequireAuth?.();
    return false;
  };

  const handleBookmark = () => {
    if (!requireAuth('Vui lòng đăng nhập để lưu quán')) return;
    toast.success(toggleBookmark(place._id) ? 'Đã lưu quán vào Bookmarks' : 'Đã bỏ lưu quán');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/#places/${place._id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết quán');
    } catch {
      toast.info(url, 'Liên kết quán');
    }
  };

  const handleSubmitReview = (payload: ReviewPayload) => {
    if (!user) return;
    saveReview(place._id, payload, user, myReview?._id);
    toast.success(myReview ? 'Đã cập nhật đánh giá của bạn' : 'Cảm ơn bạn đã đánh giá quán!');
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteReview(place._id, pendingDelete._id);
    toast.success('Đã xóa đánh giá');
    setPendingDelete(null);
  };

  const starTabs: { id: StarFilter; label: string }[] = [
    { id: 'ALL', label: `Tất cả (${reviews.length})` },
    ...([5, 4, 3, 2, 1] as const).map((n) => ({ id: n as StarFilter, label: `${n} sao` })),
  ];

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="self-start min-h-[40px] flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600"
      >
        <ArrowLeft className="w-4 h-4" /> Danh bạ quán ăn
      </button>

      {/* Gallery: 1 ảnh lớn + 4 ảnh nhỏ */}
      <section aria-label="Bộ sưu tập ảnh" className="grid grid-cols-4 grid-rows-2 gap-2 h-64 sm:h-80 rounded-3xl overflow-hidden">
        {gallery.slice(0, 5).map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setGalleryIndex(i)}
            className={cn('relative bg-slate-100 dark:bg-slate-800 overflow-hidden', i === 0 ? 'col-span-4 sm:col-span-2 row-span-2' : 'hidden sm:block')}
          >
            <img src={src} alt={`${place.name} – ảnh ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
            {i === 4 && gallery.length > 5 && (
              <span className="absolute inset-0 bg-slate-900/60 text-white font-semibold flex items-center justify-center">
                +{gallery.length - 5} ảnh
              </span>
            )}
          </button>
        ))}
      </section>

      {/* Hero info */}
      <section className="flex flex-wrap items-start justify-between gap-5">
        <div className="flex-1 min-w-[280px] flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold">
              {CATEGORY_LABELS[place.category]}
            </span>
            <span
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-bold',
                open
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
              )}
            >
              {open ? 'Đang mở cửa' : 'Đã đóng cửa'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-slate-900 dark:text-white">{place.name}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{place.address}</span>
            {place.openingHours && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {place.openingHours.open} – {place.openingHours.close}
              </span>
            )}
            <span className="font-semibold text-slate-900 dark:text-white">{formatPriceRange(place.priceRange)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant={place.isBookmarked ? 'primary' : 'outline'}
            onClick={handleBookmark}
            aria-pressed={!!place.isBookmarked}
            leftIcon={<Bookmark className={cn('w-4 h-4', place.isBookmarked && 'fill-current')} />}
          >
            {place.isBookmarked ? 'Đã lưu' : 'Lưu vào Bookmarks'}
          </Button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Navigation className="w-4 h-4" /> Chỉ đường
          </a>
          <Button variant="outline" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
            Chia sẻ
          </Button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start">
        <div className="flex flex-col gap-6 min-w-0">
          <RatingSummary ratings={place.averageRatings} totalReviews={place.totalReviews} />

          {/* Thực đơn */}
          {place.menu && place.menu.length > 0 && (
            <section className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Thực đơn</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {place.menu.map((m, i) => (
                  <li key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.name} className="w-14 h-14 rounded-lg object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 font-bold">
                        {m.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</div>
                      <div className="text-sm font-bold text-brand-600 dark:text-rose-400">
                        {m.price.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Đánh giá cộng đồng */}
          <section className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Đánh giá cộng đồng</h2>
              <Button
                onClick={() => requireAuth('Vui lòng đăng nhập để viết đánh giá') && setIsFormOpen(true)}
                leftIcon={<Star className="w-4 h-4" />}
              >
                {myReview ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá'}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {starTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={starFilter === t.id}
                  onClick={() => {
                    setStarFilter(t.id);
                    setVisibleReviews(REVIEWS_PAGE);
                  }}
                  className={cn(
                    'min-h-[36px] px-3.5 rounded-full text-xs font-semibold border transition',
                    starFilter === t.id
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  )}
                >
                  {t.label}
                </button>
              ))}
              <label className="ml-auto flex items-center gap-2 min-h-[44px] text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPhotos}
                  onChange={(e) => setOnlyPhotos(e.target.checked)}
                  className="w-4 h-4 accent-rose-600"
                />
                Chỉ xem bài có ảnh
              </label>
            </div>

            {filteredReviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Chưa có đánh giá nào phù hợp bộ lọc.
              </p>
            ) : (
              filteredReviews.slice(0, visibleReviews).map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  isMine={r._id === myReview?._id}
                  onEdit={() => setIsFormOpen(true)}
                  onDelete={() => setPendingDelete(r)}
                />
              ))
            )}

            {visibleReviews < filteredReviews.length && (
              <Button variant="outline" className="self-center" onClick={() => setVisibleReviews((v) => v + REVIEWS_PAGE)}>
                Xem thêm đánh giá
              </Button>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
          <section className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden">
            <PlaceMiniMap position={[lat, lng]} className="h-56 w-full z-0" />
            <div className="p-4 flex flex-col gap-2.5">
              <h2 className="font-bold text-slate-900 dark:text-white">Vị trí</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {place.address}
                {place.distanceMeters != null && ` · cách bạn ${place.distanceMeters}m`}
              </p>
              <Button variant="outline" onClick={onOpenMap}>
                Phóng to trên Bản đồ
              </Button>
            </div>
          </section>
          <section className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5 text-sm">
            <h2 className="font-bold text-slate-900 dark:text-white">Thông tin</h2>
            {place.openingHours && (
              <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Giờ mở cửa</span><b>{place.openingHours.open} – {place.openingHours.close}</b></div>
            )}
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Khoảng giá</span><b>{formatPriceRange(place.priceRange)}</b></div>
            <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Lượt lưu</span><b>{place.bookmarksCount ?? 0}</b></div>
          </section>
        </aside>
      </div>

      <ReviewFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        placeName={place.name}
        initialReview={myReview}
        onSubmit={handleSubmitReview}
      />

      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Xóa đánh giá?"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Hủy</Button>
            <Button variant="danger" onClick={confirmDelete}>Xóa đánh giá</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Điểm trung bình của quán sẽ được tính lại sau khi xóa. Thao tác này không thể hoàn tác.
        </p>
      </Modal>

      <Modal
        isOpen={galleryIndex !== null}
        onClose={() => setGalleryIndex(null)}
        title={place.name}
        description={galleryIndex !== null ? `Ảnh ${galleryIndex + 1} / ${gallery.length}` : undefined}
        maxWidth="2xl"
      >
        {galleryIndex !== null && (
          <div className="flex flex-col gap-3">
            <img src={gallery[galleryIndex]} alt="" className="w-full max-h-[60vh] object-contain rounded-xl bg-slate-900" />
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  aria-label={`Xem ảnh ${i + 1}`}
                  className={cn('shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2', i === galleryIndex ? 'border-brand-600' : 'border-transparent')}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
