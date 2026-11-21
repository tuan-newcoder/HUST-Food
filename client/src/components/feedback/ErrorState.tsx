import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã xảy ra sự cố tải dữ liệu',
  message = 'Không thể kết nối đến máy chủ hoặc dữ liệu bị gián đoạn. Vui lòng thử lại sau giây lát.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#151D2C] rounded-3xl p-8 sm:p-12 text-center border border-red-100 dark:border-red-900/40 shadow-sm flex flex-col items-center justify-center transition-colors duration-150',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 flex items-center justify-center mb-4 text-red-600 dark:text-red-400 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 max-w-sm">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
        >
          Thử lại
        </Button>
      )}
    </div>
  );
};
