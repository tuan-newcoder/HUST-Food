import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Search, Bell, Bookmark, LogOut, User as UserIcon, PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown } from '@/components/common/Dropdown';
import { Button } from '@/components/common/Button';

interface HeaderProps {
  onOpenCreatePost?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreatePost }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              HUST-Food
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
              Social Gourmet
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm món ngon, quán ăn quanh HUST, công thức..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Button Tạo bài viết */}
              <Button
                variant="primary"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={onOpenCreatePost || (() => navigate('/posts/create'))}
                className="hidden sm:inline-flex"
              >
                Đăng bài
              </Button>

              {/* Bookmarks Quick Link */}
              <Link
                to="/bookmarks"
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-600 transition-colors"
                title="Danh sách đã lưu"
              >
                <Bookmark className="w-5 h-5" />
              </Link>

              {/* Notifications Quick Link */}
              <button
                type="button"
                className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-brand-600 transition-colors"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
              </button>

              {/* User Dropdown */}
              <Dropdown
                trigger={
                  <div className="flex items-center gap-2 pl-1">
                    <Avatar
                      src={user.avatarUrl}
                      name={user.fullName || user.username}
                      size="sm"
                    />
                  </div>
                }
                items={[
                  {
                    label: (
                      <div className="flex flex-col py-1">
                        <span className="font-semibold text-slate-900">{user.fullName}</span>
                        <span className="text-xs text-slate-500">@{user.username}</span>
                      </div>
                    ),
                  },
                  { divider: true, label: '' },
                  {
                    label: 'Trang cá nhân',
                    icon: <UserIcon />,
                    onClick: () => navigate(`/profile/${user.username}`),
                  },
                  {
                    label: 'Quán & Bài đã lưu',
                    icon: <Bookmark />,
                    onClick: () => navigate('/bookmarks'),
                  },
                  { divider: true, label: '' },
                  {
                    label: 'Đăng xuất',
                    icon: <LogOut />,
                    danger: true,
                    onClick: () => logout(),
                  },
                ]}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth/login')}
              >
                Đăng nhập
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth/register')}
              >
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

