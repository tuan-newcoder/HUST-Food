import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface StarRatingProps {
  value: number; // 0 to 5
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  label?: string;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 5,
  size = 'md',
  readonly = true,
  onChange,
  showValue = false,
  label,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 select-none', className)}>
      {label && (
        <span className={cn('font-semibold text-slate-700 dark:text-slate-200 mr-1', textSizes[size])}>
          {label}
        </span>
      )}

      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, index) => {
          const starIndex = index + 1;
          const isFilled = value >= starIndex;
          const isHalf = !isFilled && value >= starIndex - 0.5;

          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={() => !readonly && onChange?.(starIndex)}
              className={cn(
                'transition-all duration-150',
                readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
              )}
              title={readonly ? undefined : `Đánh giá ${starIndex} sao`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-amber-500 text-amber-500'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-500'
                    : 'fill-slate-100 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                )}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className={cn('font-bold text-amber-700 dark:text-amber-400 ml-1', textSizes[size])}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export interface CriteriaRatingsProps {
  ratings?: {
    taste?: number;
    price?: number;
    hygiene?: number;
    service?: number;
    overall?: number;
  };
  compact?: boolean;
}

export const CriteriaRatings: React.FC<CriteriaRatingsProps> = ({
  ratings = {},
  compact = false,
}) => {
  const criteria = [
    { key: 'taste', label: 'Hương vị', value: ratings.taste || 0 },
    { key: 'price', label: 'Giá cả', value: ratings.price || 0 },
    { key: 'hygiene', label: 'Vệ sinh', value: ratings.hygiene || 0 },
    { key: 'service', label: 'Phục vụ', value: ratings.service || 0 },
  ];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {criteria.map((item) => (
          <div key={item.key} className="flex items-center gap-1">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              {item.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
      {criteria.map((item) => (
        <div key={item.key} className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
          <div className="flex items-center gap-1">
            <StarRating value={item.value} size="sm" readonly showValue />
          </div>
        </div>
      ))}
    </div>
  );
};
