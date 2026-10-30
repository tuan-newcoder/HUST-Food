import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Bookmark,
  User,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  const navItems = [
    {
      label: 'Bảng tin (Feed)',
      path: '/',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      label: 'Địa điểm Quán ăn',
      path: '/places',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      label: 'Bản đồ Ẩm thực',
      path: '/maps',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: 'Danh sách đã lưu',
      path: '/bookmarks',
      icon: <Bookmark className="w-5 h-5" />,
      requireAuth: true,
    },
    {
      label: 'Trang cá nhân',
      path: user ? `/profile/${user.username}` : '/auth/login',
      icon: <User className="w-5 h-5" />,
      requireAuth: true,
    },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({
      label: 'Quản trị (Admin)',
      path: '/admin',
      icon: <ShieldCheck className="w-5 h-5" />,
      requireAuth: true,
    });
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col gap-6 sticky top-20 h-[calc(100vh-5rem)] pb-6 overflow-y-auto">
      {/* Main Nav */}
      <nav className="flex flex-col gap-1 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <span className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Khám phá
        </span>

        {navItems.map((item) => {
          if (item.requireAuth && !isAuthenticated) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-500/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn('transition-transform duration-150', isActive && 'scale-110 text-brand-600')}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Promotion / Community Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-5 text-white shadow-lg shadow-brand-500/20">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-200" />
            <span className="text-xs font-bold tracking-wider uppercase text-white/90">
              Cộng đồng HUST
            </span>
          </div>
          <h4 className="text-sm font-extrabold leading-snug">
            Khám phá quán ngon chuẩn vị sinh viên Bách Khoa!
          </h4>
          <p className="text-xs text-white/80">
            Cùng đánh giá 4 tiêu chí và chia sẻ công thức nấu ăn cho mọi người.
          </p>
        </div>
        {/* Background glow decoration */}
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* Mini Stats or Trending Tags Link */}
      <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 p-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent-500" />
          <span>#HUST-Food v6.0</span>
        </div>
        <span className="font-semibold text-brand-600">Active</span>
      </div>
    </aside>
  );
};

