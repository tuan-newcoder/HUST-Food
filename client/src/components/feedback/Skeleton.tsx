import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80', className)}
      {...props}
    />
  );
};

export const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#151D2C] rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm mb-6 animate-pulse transition-colors duration-150">
      {/* Header: Avatar + Author Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="w-32 h-4 rounded-lg" />
            <Skeleton className="w-24 h-3 rounded-lg" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>

      {/* Title */}
      <Skeleton className="w-3/4 h-5 rounded-lg mb-3" />

      {/* Content lines */}
      <div className="space-y-2 mb-4">
        <Skeleton className="w-full h-3.5 rounded-lg" />
        <Skeleton className="w-5/6 h-3.5 rounded-lg" />
        <Skeleton className="w-2/3 h-3.5 rounded-lg" />
      </div>

      {/* Image Skeleton */}
      <Skeleton className="w-full h-64 rounded-2xl mb-4" />

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-8 rounded-xl" />
          <Skeleton className="w-28 h-8 rounded-xl" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-8 h-8 rounded-xl" />
          <Skeleton className="w-8 h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-pulse">
      <div className="bg-white dark:bg-[#151D2C] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <Skeleton className="h-44 sm:h-56 w-full rounded-none" />
        <div className="px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white dark:ring-slate-900" />
              <div className="space-y-2 text-center sm:text-left">
                <Skeleton className="w-40 h-6 rounded-lg" />
                <Skeleton className="w-24 h-4 rounded-lg" />
              </div>
            </div>
            <Skeleton className="w-32 h-10 rounded-xl" />
          </div>
          <Skeleton className="w-full max-w-xl h-4 rounded-lg mb-2" />
          <Skeleton className="w-3/4 max-w-lg h-4 rounded-lg mb-6" />
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between">
            <Skeleton className="w-36 h-4 rounded-lg" />
            <Skeleton className="w-48 h-4 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
