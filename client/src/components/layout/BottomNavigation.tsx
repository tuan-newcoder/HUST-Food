import React from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Compass, MapPin, Bookmark, User } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/utils/cn';

export const BottomNavigation: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  const navItems = [
    { label: 'Bảng tin', path: '/', icon: <Flame className="w-5 h-5" /> },
    { label: 'Quán ăn', path: '/places', icon: <Compass className="w-5 h-5" /> },
    { label: 'Bản đồ', path: '/maps', icon: <MapPin className="w-5 h-5" /> },
    {
      label: 'Đã lưu',
      path: isAuthenticated ? '/bookmarks' : '/auth/login',
      icon: <Bookmark className="w-5 h-5" />,
    },
    {
      label: 'Cá nhân',
      path: isAuthenticated && user ? `/profile/${user.username}` : '/auth/login',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 px-3 transition-colors',
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              )
            }
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

