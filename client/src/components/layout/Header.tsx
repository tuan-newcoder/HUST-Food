import React, { useState } from 'react';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch = () => {} }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#F8FAFC]/90 backdrop-blur-md py-4 px-8 border-b border-[#E2E8F0]/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        {/* Search Bar - Width & height matching Figma specification */}
        <div className="flex-1 max-w-[760px] relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#64748B]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm bún cá, cơm bình dân, quán xá quanh Bách Khoa..."
            className="w-full h-[50px] pl-11 pr-4 rounded-[14px] bg-white border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E11D48]/20 focus:border-[#E11D48] transition-all"
          />
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button
            title="Thông báo"
            className="w-[46px] h-[46px] rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 flex items-center justify-center relative shadow-sm transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            {/* Unread badge dot */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] absolute top-2.5 right-2.5 ring-2 ring-white" />
          </button>

          {/* Chat / Messages Button */}
          <button
            title="Tin nhắn"
            className="w-[46px] h-[46px] rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50 flex items-center justify-center shadow-sm transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          {/* Avatar Profile mini */}
          <button className="flex items-center gap-2 pl-2 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
