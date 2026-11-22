import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Review } from '@/types/review.types';
import { formatTimeAgo } from '@/utils/formatDate';
import { CRITERIA } from '@/features/places/placeUtils';

interface ReviewCardProps {
  review: Review;
  isMine?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, isMine, onEdit, onDelete }) => (
  <article className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
    <div className="flex items-center gap-3">
      <Avatar src={review.author.avatarUrl} name={review.author.fullName} size="md" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          {review.author.fullName}
          {isMine && (
            <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-brand-600 dark:text-rose-400 text-[10px] font-bold">
              Của bạn
            </span>
          )}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {formatTimeAgo(review.createdAt)}
          {review.updatedAt && ' · đã chỉnh sửa'}
        </div>
      </div>
      <span className="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-sm">
        {review.ratings.overall.toFixed(1)} ★
      </span>
    </div>

    <div className="flex flex-wrap gap-2">
      {CRITERIA.map(({ key, label }) => (
        <span
          key={key}
          className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300"
        >
          {label} <b>{review.ratings[key]}</b>
        </span>
      ))}
    </div>

    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
      {review.content}
    </p>

    {review.images.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        {review.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Ảnh thực tế ${i + 1}`}
            loading="lazy"
            className="w-24 h-24 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
          />
        ))}
      </div>
    )}

    {isMine && (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="min-h-[36px] px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="min-h-[36px] px-3 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Xóa
        </button>
      </div>
    )}
  </article>
);
