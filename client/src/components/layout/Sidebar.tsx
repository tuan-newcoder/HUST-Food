import React from 'react';

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenCreatePost?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab = 'home',
  onTabChange = () => {},
  onOpenCreatePost = () => {},
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      id: 'map',
      label: 'Food Map',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
    {
      id: 'places',
      label: 'Places',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
          <path d="M2 7h20"/>
          <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 10V7"/>
        </svg>
      ),
    },
    {
      id: 'bookmarks',
      label: 'Bookmarks',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-[308px] h-screen fixed left-0 top-0 bg-white border-r border-[#E2E8F0] flex flex-col justify-between z-30 select-none">
      {/* Top Part: Logo & Navigation */}
      <div className="p-6 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3.5 mb-8 cursor-pointer" onClick={() => onTabChange('home')}>
          <div className="w-[42px] h-[42px] rounded-[13px] bg-[#E11D48] flex items-center justify-center shadow-md shadow-rose-500/20">
            {/* Soup bowl icon matching Figma */}
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11h16a8 8 0 0 1-16 0Z" />
              <path d="M8 19h8" />
              <path d="M7 4c-1 1.5 1 1.5 0 3" />
              <path d="M12 3c-1 1.5 1 1.5 0 3" />
              <path d="M17 4c-1 1.5 1 1.5 0 3" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight text-[#0F172A] leading-tight flex items-center gap-1">
              HUST<span className="text-[#E11D48]">-FOOD</span>
            </div>
            <div className="text-[10px] tracking-wider font-semibold text-[#64748B] uppercase">
              Ẩm thực Bách Khoa
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="text-[11px] font-bold tracking-wider text-[#64748B] uppercase mb-3 px-3">
          Khám phá
        </div>

        {/* Nav Items */}
        <nav className="space-y-1.5 mb-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FFF1F2] text-[#E11D48]'
                    : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={isActive ? 'text-[#E11D48]' : 'text-[#64748B]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button: Tạo bài viết */}
        <button
          onClick={onOpenCreatePost}
          className="w-full h-[50px] rounded-xl bg-[#E11D48] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-rose-500/25 hover:bg-rose-700 active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Tạo bài viết</span>
        </button>

        {/* Promo card / Mẹo hay hôm nay */}
        <div className="mt-6 p-4 rounded-2xl bg-[#FFFBEB] border border-amber-200/60 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#0F172A] mb-1.5">
            <span className="text-amber-500">💡</span>
            <span>Mẹo hay hôm nay</span>
          </div>
          <p className="text-[#B45309] leading-relaxed">
            Khám phá <strong>Bản đồ ẩm thực</strong> quanh Bách Khoa để tìm các quán ăn chuẩn ngon - bổ - rẻ nhé!
          </p>
        </div>
      </div>

      {/* Bottom Part: User info card */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Nguyễn Văn A"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100"
            />
            <div className="text-left">
              <div className="text-sm font-bold text-[#0F172A] leading-tight">
                Nguyễn Văn A
              </div>
              <div className="text-xs text-[#64748B]">
                @nguyenvana • K66
              </div>
            </div>
          </div>
          <button
            title="Đăng xuất"
            className="p-2 text-[#64748B] hover:text-[#E11D48] hover:bg-rose-50 rounded-lg transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
