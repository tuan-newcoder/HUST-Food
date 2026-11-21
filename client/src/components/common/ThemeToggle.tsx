import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { cn } from '@/utils/cn';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = 'icon',
  showLabel = false,
}) => {
  const { isDark, toggleTheme } = useThemeStore();

  if (variant === 'pill' || showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        className={cn(
          'min-h-[44px] px-3.5 py-2 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold transition-all duration-200 select-none border',
          isDark
            ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800 hover:text-amber-300'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900',
          className
        )}
      >
        <div className="flex items-center gap-2">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-300" />
          )}
          <span>{isDark ? 'Giao diện tối' : 'Giao diện sáng'}</span>
        </div>

        {/* Mini Pill Switch */}
        <div
          className={cn(
            'w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center',
            isDark ? 'bg-brand-600' : 'bg-slate-300'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
              isDark ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
      className={cn(
        'min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center border shadow-sm transition-all duration-200 select-none',
        isDark
          ? 'bg-slate-800/90 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900',
        className
      )}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
