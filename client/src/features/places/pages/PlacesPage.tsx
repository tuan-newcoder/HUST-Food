import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { toast } from '@/components/feedback/Toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { PlaceCategory } from '@/types/place.types';
import { cn } from '@/utils/cn';
import { PlaceCard } from '../components/PlaceCard';
import { usePlaceStore } from '../usePlaceStore';
import { CATEGORY_LABELS, isOpenNow } from '../placeUtils';

interface PlacesPageProps {
  onSelectPlace: (placeId: string) => void;
  onAddPlace: () => void;
  onRequireAuth?: () => void;
}

type SortKey = 'rating' | 'reviews' | 'newest';
type QuickFilter = 'ALL' | 'OPEN' | 'CHEAP' | 'TOP';

const PAGE_SIZE = 8;

const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'OPEN', label: 'Đang mở cửa' },
  { id: 'CHEAP', label: 'Dưới 40.000đ' },
  { id: 'TOP', label: '4.5★ trở lên' },
];

const selectClass =
  'h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-brand-600';

export const PlacesPage: React.FC<PlacesPageProps> = ({ onSelectPlace, onAddPlace, onRequireAuth }) => {
  const { places, toggleBookmark } = usePlaceStore();
  const { isAuthenticated } = useAuthStore();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'ALL' | PlaceCategory>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('rating');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [quick, setQuick] = useState<QuickFilter>('ALL');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = Number(minPrice.replace(/\D/g, '')) || 0;
    const max = Number(maxPrice.replace(/\D/g, '')) || Infinity;

    const list = places.filter((p) => {
      if (q) {
        const inMenu = p.menu?.some((m) => m.name.toLowerCase().includes(q));
        if (!p.name.toLowerCase().includes(q) && !p.address.toLowerCase().includes(q) && !inMenu) {
          return false;
        }
      }
      if (category !== 'ALL' && p.category !== category) return false;
      if (p.priceRange.max < min || p.priceRange.min > max) return false;
      if (quick === 'OPEN' && !isOpenNow(p.openingHours)) return false;
      if (quick === 'CHEAP' && p.priceRange.min >= 40000) return false;
      if (quick === 'TOP' && (p.averageRatings?.overall ?? 0) < 4.5) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'reviews') return (b.totalReviews ?? 0) - (a.totalReviews ?? 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.averageRatings?.overall ?? 0) - (a.averageRatings?.overall ?? 0);
    });
  }, [places, query, category, sortBy, minPrice, maxPrice, quick]);

  const handleBookmark = (placeId: string) => {
    if (!isAuthenticated) {
      toast.warning('Vui lòng đăng nhập để lưu quán', 'Yêu cầu đăng nhập');
      onRequireAuth?.();
      return;
    }
    const saved = toggleBookmark(placeId);
    toast.success(saved ? 'Đã lưu quán vào Bookmarks' : 'Đã bỏ lưu quán');
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('ALL');
    setMinPrice('');
    setMaxPrice('');
    setQuick('ALL');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Khám phá quán ăn
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Danh bạ quán xá quanh Bách Khoa — Tạ Quang Bửu, Lê Thanh Nghị, Trần Đại Nghĩa.
          </p>
        </div>
        <Button onClick={onAddPlace} leftIcon={<Plus className="w-4 h-4" />}>
          Đóng góp quán mới
        </Button>
      </div>

      {/* Bộ lọc */}
      <section
        aria-label="Bộ lọc quán ăn"
        className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.3fr]"
      >
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          Tìm kiếm
          <span className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Tên quán, địa chỉ, món ăn…"
              className={cn(selectClass, 'w-full pl-9')}
            />
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          Danh mục
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'ALL' | PlaceCategory)}
            className={selectClass}
          >
            <option value="ALL">Tất cả danh mục</option>
            {(['RESTAURANT', 'CAFE', 'STREET_FOOD', 'BAKERY'] as PlaceCategory[]).map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          Sắp xếp
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className={selectClass}>
            <option value="rating">Điểm đánh giá cao nhất</option>
            <option value="reviews">Nhiều lượt review nhất</option>
            <option value="newest">Mới đóng góp gần đây</option>
          </select>
        </label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Khoảng giá (đ)
          </legend>
          <div className="flex items-center gap-2">
            <input
              inputMode="numeric"
              aria-label="Giá tối thiểu"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Từ 15.000"
              className={cn(selectClass, 'w-full min-w-0')}
            />
            <span className="text-slate-400">–</span>
            <input
              inputMode="numeric"
              aria-label="Giá tối đa"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Đến 70.000"
              className={cn(selectClass, 'w-full min-w-0')}
            />
          </div>
        </fieldset>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setQuick(f.id)}
            aria-pressed={quick === f.id}
            className={cn(
              'min-h-[36px] px-3.5 rounded-full text-xs font-semibold border transition',
              quick === f.id
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">
          Tìm thấy <b className="text-slate-900 dark:text-white">{filtered.length}</b> quán
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="Không tìm thấy quán phù hợp"
          description="Thử bỏ bớt bộ lọc hoặc tìm với từ khóa khác."
          actionLabel="Xóa bộ lọc"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.slice(0, visible).map((p) => (
            <PlaceCard key={p._id} place={p} onSelect={onSelectPlace} onToggleBookmark={handleBookmark} />
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div className="flex justify-center pb-4">
          <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Tải thêm quán ăn
          </Button>
        </div>
      )}
    </div>
  );
};
