import React from 'react';

interface QuickPostBarProps {
  onOpenModal?: () => void;
}

export const QuickPostBar: React.FC<QuickPostBarProps> = ({ onOpenModal = () => {} }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm mb-6">
      <div className="flex items-center gap-3.5 mb-3.5">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div
          onClick={onOpenModal}
          className="flex-1 h-11 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-sm flex items-center cursor-pointer hover:bg-slate-100/70 hover:border-slate-300 transition"
        >
          Hôm nay bạn ăn gì ở Bách Khoa? Chia sẻ ngay...
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs font-semibold text-[#64748B]">
        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 hover:text-[#E11D48] transition"
        >
          <svg className="w-4 h-4 text-[#E11D48]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span>Đăng ảnh trải nghiệm</span>
        </button>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-50 hover:text-[#F59E0B] transition"
        >
          <svg className="w-4 h-4 text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10"/>
            <path d="M6 10h10"/>
          </svg>
          <span>Chia sẻ công thức</span>
        </button>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition"
        >
          <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Check-in quán xá</span>
        </button>
      </div>
    </div>
  );
};
