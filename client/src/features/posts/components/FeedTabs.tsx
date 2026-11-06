import React from 'react';

export type FeedTabType = 'all' | 'experience' | 'recipe';

interface FeedTabsProps {
  activeTab: FeedTabType;
  onChange: (tab: FeedTabType) => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'all', label: 'Tất cả bài viết' },
    { id: 'experience', label: '🍜 Trải nghiệm quán' },
    { id: 'recipe', label: '🍳 Công thức nấu ăn' },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 border-b border-[#E2E8F0] pb-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as FeedTabType)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive
                ? 'bg-[#E11D48] text-white shadow-sm shadow-rose-500/20'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
