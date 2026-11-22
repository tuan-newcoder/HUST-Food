import React from 'react';
import { Bookmark, MapPin, Star } from 'lucide-react';
import { Place } from '@/types/place.types';
import { cn } from '@/utils/cn';
import { CATEGORY_LABELS, formatPriceRange, isOpenNow } from '../placeUtils';

interface PlaceCardProps {
  place: Place;
  onSelect: (placeId: string) => void;
  onToggleBookmark: (placeId: string) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect, onToggleBookmark }) => {
  const open = isOpenNow(place.openingHours);

  return (
    <article className="group relative flex flex-col bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <button
        type="button"
        onClick={() => onSelect(place._id)}
        className="text-left flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-2xl"
      >
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={place.coverImage}
            alt={place.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={cn(
              'absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm',
              open
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
            )}
          >
            {open ? 'Đang mở cửa' : 'Đã đóng cửa'}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-1.5 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {CATEGORY_LABELS[place.category]}
          </span>
          <h3 className="font-bold text-[15px] leading-snug text-slate-900 dark:text-white line-clamp-2">
            {place.name}
          </h3>
          <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{place.address}</span>
          </p>
          <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <b className="text-slate-900 dark:text-white">
                {(place.averageRatings?.overall ?? 0).toFixed(1)}
              </b>
              <span className="text-slate-500 dark:text-slate-400">({place.totalReviews ?? 0})</span>
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatPriceRange(place.priceRange)}
            </span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onToggleBookmark(place._id)}
        aria-label={place.isBookmarked ? 'Bỏ lưu quán' : 'Lưu quán vào Bookmarks'}
        aria-pressed={!!place.isBookmarked}
        className={cn(
          'absolute top-2 right-2 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm backdrop-blur transition',
          place.isBookmarked
            ? 'bg-brand-600 text-white'
            : 'bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-brand-600'
        )}
      >
        <Bookmark className={cn('w-[18px] h-[18px]', place.isBookmarked && 'fill-current')} />
      </button>
    </article>
  );
};
