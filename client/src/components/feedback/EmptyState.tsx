import React from 'react';
import { Utensils, Search, Bookmark, Inbox } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

export interface EmptyStateProps {
  icon?: 'food' | 'search' | 'bookmark' | 'inbox' | React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    switch (icon) {
      case 'food':
        return <Utensils className="w-8 h-8 text-brand-600 dark:text-rose-400" />;
      case 'search':
        return <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />;
      case 'bookmark':
        return <Bookmark className="w-8 h-8 text-amber-500 dark:text-amber-400" />;
      case 'inbox':
      default:
        return <Inbox className="w-8 h-8 text-slate-400 dark:text-slate-500" />;
    }
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-[#151D2C] rounded-3xl p-8 sm:p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center transition-colors duration-150',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 shadow-sm">
        {renderIcon()}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 max-w-sm">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
