import React from 'react';
import { Flame, MapPin, Store, Bookmark, User } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/cn';

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenAuth?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = 'home',
  onTabChange = () => {},
  onOpenAuth,
}) => {
  const { isAuthenticated } = useAuthStore();

  const navItems = [
    { id: 'home', label: 'Bảng tin', icon: <Flame className="w-5 h-5" /> },
    { id: 'map', label: 'Bản đồ', icon: <MapPin className="w-5 h-5" /> },
    { id: 'places', label: 'Quán ăn', icon: <Store className="w-5 h-5" /> },
    {
      id: 'bookmarks',
      label: 'Đã lưu',
      icon: <Bookmark className="w-5 h-5" />,
      requiresAuth: true,
    },
    {
      id: 'profile',
      label: 'Cá nhân',
      icon: <User className="w-5 h-5" />,
      requiresAuth: true,
    },
  ];

  const handleItemClick = (item: (typeof navItems)[0]) => {
    if (item.requiresAuth && !isAuthenticated) {
      onOpenAuth?.();
      return;
    }
    onTabChange(item.id);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-[#151D2C]/95 backdrop-blur-md px-2 py-1 shadow-lg shadow-slate-900/10 transition-colors duration-150"
      aria-label="Thanh điều hướng di động"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className={cn(
                'min-w-[52px] min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl py-1 px-2.5 transition-all select-none',
                isActive
                  ? 'text-brand-600 dark:text-rose-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
              )}
            >
              <div
                className={cn(
                  'transition-transform duration-150',
                  isActive && 'scale-110'
                )}
              >
                {item.icon}
              </div>
              <span className="text-[11px] leading-none tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
