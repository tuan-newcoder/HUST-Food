import React from 'react';
import { Layers, UtensilsCrossed, ChefHat } from 'lucide-react';
import { cn } from '@/utils/cn';

export type FeedTabType = 'ALL' | 'EXPERIENCE' | 'RECIPE';

interface FeedTabsProps {
  activeTab: FeedTabType;
  onChange: (tab: FeedTabType) => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    {
      id: 'ALL' as const,
      label: 'Tất cả bài viết',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'EXPERIENCE' as const,
      label: 'Trải nghiệm quán',
      icon: <UtensilsCrossed className="w-4 h-4" />,
    },
    {
      id: 'RECIPE' as const,
      label: 'Công thức nấu ăn',
      icon: <ChefHat className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className="flex items-center gap-2 mb-6 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl w-fit max-w-full overflow-x-auto select-none transition-colors duration-150"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 select-none',
              isActive
                ? 'bg-white dark:bg-[#151D2C] text-brand-600 dark:text-rose-400 shadow-sm shadow-slate-200/60 dark:shadow-none'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
            )}
          >
            <span
              className={cn(
                'transition-colors',
                isActive ? 'text-brand-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
              )}
            >
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
