import React from 'react';
import {
  Flame,
  MapPin,
  Store,
  Bookmark,
  User,
  PlusCircle,
  UtensilsCrossed,
  LogOut,
  LogIn,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { toast } from '@/components/feedback/Toast';
import { cn } from '@/utils/cn';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenCreatePost?: () => void;
  onOpenAuth?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'home',
  onTabChange = () => {},
  onOpenCreatePost = () => {},
  onOpenAuth,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    logout();
    toast.info('Bạn đã đăng xuất tài khoản');
  };

  const navItems = [
    {
      id: 'home',
      label: 'Bảng tin',
      icon: <Flame className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'map',
      label: 'Bản đồ ẩm thực',
      icon: <MapPin className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'places',
      label: 'Quán ăn & Địa điểm',
      icon: <Store className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'bookmarks',
      label: 'Mục đã lưu',
      icon: <Bookmark className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'profile',
      label: 'Trang cá nhân',
      icon: <User className="w-5 h-5 shrink-0" />,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-6 select-none bg-white dark:bg-[#151D2C] transition-colors duration-150">
      {/* Top Part: Logo & Navigation */}
      <div className="overflow-y-auto">
        {/* Logo Brand */}
        <div className="flex items-center justify-between mb-8">
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => {
              onTabChange('home');
              onCloseMobile?.();
            }}
          >
            <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-all">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                HUST<span className="text-brand-600">-FOOD</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                Ẩm thực Bách Khoa
              </div>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Create Post Action Button */}
        <div className="mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              onOpenCreatePost();
              onCloseMobile?.();
            }}
            leftIcon={<PlusCircle className="w-5 h-5" />}
            className="w-full shadow-md shadow-rose-500/20"
          >
            Đăng bài viết mới
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" aria-label="Menu chính">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile?.();
                }}
                className={cn(
                  'w-full min-h-[48px] flex items-center gap-3.5 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 text-left',
                  isActive
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-brand-600 dark:text-rose-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                )}
              >
                <span
                  className={cn(
                    'transition-colors',
                    isActive ? 'text-brand-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-5 rounded-full bg-brand-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Part: Theme Toggle & User Info / Auth */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        {/* Theme Mode Toggle Pill Switch */}
        <div>
          <ThemeToggle variant="pill" showLabel className="w-full" />
        </div>

        {isAuthenticated && user ? (
          <div
            onClick={() => {
              onTabChange('profile');
              onCloseMobile?.();
            }}
            className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={user.avatarUrl}
                name={user.fullName}
                size="md"
                className="ring-2 ring-rose-200 dark:ring-rose-900"
              />
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 transition">
                  {user.fullName}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{user.username}
                </div>
              </div>
            </div>

            <button
              type="button"
              title="Đăng xuất"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2.5 font-medium">
              Đăng nhập để chia sẻ quán ngon và lưu địa điểm yêu thích
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenAuth?.();
                onCloseMobile?.();
              }}
              leftIcon={<LogIn className="w-4 h-4" />}
              className="w-full bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 min-h-[44px]"
            >
              Đăng nhập ngay
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-[280px] xl:w-[308px] h-screen fixed left-0 top-0 bg-white dark:bg-[#151D2C] border-r border-slate-200/80 dark:border-slate-800 flex-col z-30 transition-colors duration-150">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (When open) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative w-[300px] max-w-[85vw] h-full bg-white dark:bg-[#151D2C] shadow-2xl z-10 flex flex-col transition-colors duration-150">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
