import React from 'react';
import { UtensilsCrossed, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800">HUST-Food</span>
            <span className="text-xs text-slate-400">© 2026 Nhóm dự án HUST</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link to="/" className="hover:text-brand-600">Trang chủ</Link>
            <Link to="/places" className="hover:text-brand-600">Địa điểm quán</Link>
            <Link to="/maps" className="hover:text-brand-600">Bản đồ</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-600">GitHub</a>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
            <span>for HUSTers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

