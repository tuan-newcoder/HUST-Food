import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  LogIn,
  User as UserIcon,
  Bookmark,
  LogOut,
  ChevronDown,
  X,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown } from '@/components/common/Dropdown';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { toast } from '@/components/feedback/Toast';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { AppNotification } from '@/types/notification.types';

interface HeaderProps {
  onSearch?: (query: string) => void;
  onOpenProfile?: () => void;
  onOpenBookmarks?: () => void;
  onOpenAuth?: () => void;
  onToggleMobileMenu?: () => void;
  onOpenNotification?: (n: AppNotification) => void;
  onViewAllNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearch = () => {},
  onOpenProfile,
  onOpenBookmarks,
  onOpenAuth,
  onToggleMobileMenu,
  onOpenNotification,
  onViewAllNotifications,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  const handleLogout = () => {
    logout();
    toast.info('Bạn đã đăng xuất thành công');
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-50/90 dark:bg-[#0B0F19]/90 backdrop-blur-md py-3.5 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-150">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile Menu Toggle Button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Mở menu"
            className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-[720px] relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm bún cá, cơm bình dân, quán xá quanh Bách Khoa..."
            className="w-full h-11 sm:h-12 pl-10 pr-9 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-brand-600 transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Xóa tìm kiếm"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Mode Toggle Button */}
          <ThemeToggle />

          {/* Notification Bell (F21–F22) — chỉ hiển thị khi đã đăng nhập */}
          {isAuthenticated && (
            <NotificationBell
              onOpenNotification={(n) => onOpenNotification?.(n)}
              onViewAll={() => onViewAllNotifications?.()}
            />
          )}

          {/* Chat / Messages Button */}
          <button
            type="button"
            title="Tin nhắn"
            onClick={() => toast.info('Tính năng tin nhắn đang phát triển')}
            className="hidden sm:flex min-w-[44px] min-h-[44px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 items-center justify-center shadow-sm transition"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* User Auth Section */}
          {isAuthenticated && user ? (
            <Dropdown
              trigger={
                <div className="flex items-center gap-2 min-h-[44px] pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800 transition cursor-pointer select-none">
                  <Avatar
                    src={user.avatarUrl}
                    name={user.fullName}
                    size="md"
                    className="ring-2 ring-rose-200 dark:ring-rose-900"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </div>
              }
              items={[
                {
                  label: (
                    <div className="text-left py-0.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        @{user.username}
                      </div>
                    </div>
                  ),
                  onClick: onOpenProfile,
                },
                {
                  divider: true,
                  label: 'Trang cá nhân',
                  icon: <UserIcon className="w-4 h-4 text-brand-600" />,
                  onClick: onOpenProfile,
                },
                {
                  label: 'Mục đã lưu (Bookmarks)',
                  icon: <Bookmark className="w-4 h-4 text-amber-500" />,
                  onClick: onOpenBookmarks,
                },
                {
                  divider: true,
                  label: 'Đăng xuất',
                  icon: <LogOut className="w-4 h-4 text-red-500" />,
                  danger: true,
                  onClick: handleLogout,
                },
              ]}
            />
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAuth}
              leftIcon={<LogIn className="w-4 h-4" />}
              className="min-h-[44px]"
            >
              <span className="hidden sm:inline">Đăng nhập</span>
              <span className="sm:hidden">Vào</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
