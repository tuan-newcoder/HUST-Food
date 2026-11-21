import React from 'react';
import { Image as ImageIcon, BookOpen, MapPin } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Avatar } from '@/components/common/Avatar';

interface QuickPostBarProps {
  onOpenModal?: (type?: 'EXPERIENCE' | 'RECIPE') => void;
}

export const QuickPostBar: React.FC<QuickPostBarProps> = ({ onOpenModal = () => {} }) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-white dark:bg-[#151D2C] rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm mb-6 transition-colors duration-150">
      <div className="flex items-center gap-3.5 mb-3.5">
        <Avatar
          src={user?.avatarUrl}
          name={user?.fullName || 'User'}
          size="md"
          className="ring-2 ring-rose-100 dark:ring-rose-900"
        />
        <div
          onClick={() => onOpenModal('EXPERIENCE')}
          className="flex-1 h-11 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs sm:text-sm flex items-center cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition"
        >
          Hôm nay bạn ăn gì ở Bách Khoa? Chia sẻ ngay với mọi người...
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <button
          type="button"
          onClick={() => onOpenModal('EXPERIENCE')}
          className="min-h-[40px] flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-brand-600 dark:hover:text-rose-400 transition"
        >
          <ImageIcon className="w-4 h-4 text-brand-600 dark:text-rose-400" />
          <span>Đăng ảnh trải nghiệm</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenModal('RECIPE')}
          className="min-h-[40px] flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600 dark:hover:text-amber-400 transition"
        >
          <BookOpen className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          <span>Chia sẻ công thức</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenModal('EXPERIENCE')}
          className="min-h-[40px] flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>Gắn thẻ Quán ăn</span>
        </button>
      </div>
    </div>
  );
};
