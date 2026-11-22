import React from 'react';
import { StarRating } from '@/components/common/StarRating';
import { PlaceRatings } from '@/types/place.types';
import { CRITERIA } from '@/features/places/placeUtils';

interface RatingSummaryProps {
  ratings?: PlaceRatings;
  totalReviews?: number;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ ratings, totalReviews = 0 }) => {
  const overall = ratings?.overall ?? 0;

  return (
    <section
      aria-label="Bảng điểm đánh giá"
      className="bg-white dark:bg-[#151D2C] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-6 sm:items-center"
    >
      <div className="sm:w-44 shrink-0 flex flex-col items-center gap-2 text-center">
        <div>
          <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{overall.toFixed(1)}</span>
          <span className="text-lg text-slate-500 dark:text-slate-400"> / 5.0</span>
        </div>
        <StarRating value={overall} size="lg" />
        <span className="text-xs text-slate-500 dark:text-slate-400">{totalReviews} bài đánh giá</span>
      </div>

      <div className="flex-1 flex flex-col gap-3.5">
        {CRITERIA.map(({ key, label }) => {
          const score = ratings?.[key] ?? 0;
          return (
            <div key={key} className="grid grid-cols-[88px_1fr_44px] items-center gap-3 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
              <div
                className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                role="meter"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-valuenow={score}
              >
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${(score / 5) * 100}%` }} />
              </div>
              <span className="text-right font-bold text-slate-900 dark:text-white">{score.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
