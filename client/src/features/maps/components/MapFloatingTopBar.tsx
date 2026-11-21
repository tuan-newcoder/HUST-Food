import React from 'react';
import { PlaceCategory } from '../types';

interface MapFloatingTopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  radiusMeters: number;
  onRadiusChange: (radius: number) => void;
  selectedCategory: 'ALL' | PlaceCategory;
  onCategoryChange: (cat: 'ALL' | PlaceCategory) => void;
  maxPrice?: number;
  onMaxPriceToggle: () => void;
  minRating?: number;
  onMinRatingToggle: () => void;
}

export const MapFloatingTopBar: React.FC<MapFloatingTopBarProps> = ({
  searchQuery,
  onSearchChange,
  radiusMeters,
  onRadiusChange,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceToggle,
  minRating,
  onMinRatingToggle,
}) => {
  const radiusOptions = [500, 1000, 2000, 5000];

  const formatRadius = (meters: number) => {
    if (meters >= 1000) return `${meters / 1000}km`;
    return `${meters}m`;
  };

  return (
    <div className="absolute top-4 left-6 z-[500] max-w-[640px] w-full flex flex-col gap-2.5 pointer-events-auto select-none">
      {/* Top Search + Radius Control Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.1)] border border-slate-200/90 p-2.5 flex items-center gap-3">
        {/* Search input */}
        <div className="flex-1 relative flex items-center">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm quán bún cá, cơm tấm, cà phê..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50/80 rounded-xl border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
          />
        </div>

        {/* Radius Segment Slider */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl shrink-0 gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 flex items-center gap-1">
            <span>🎯</span> Bán kính:
          </span>
          {radiusOptions.map((r) => {
            const isActive = radiusMeters === r;
            return (
              <button
                key={r}
                onClick={() => onRadiusChange(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-[#E11D48] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {formatRadius(r)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {/* Category: ALL */}
        <button
          onClick={() => onCategoryChange('ALL')}
          className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition shrink-0 backdrop-blur-sm ${
            selectedCategory === 'ALL'
              ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          Tất cả
        </button>

        {/* Chip: Quán ăn */}
        <button
          onClick={() => onCategoryChange(selectedCategory === 'RESTAURANT' ? 'ALL' : 'RESTAURANT')}
          className={`h-7 px-3 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition shrink-0 backdrop-blur-sm ${
            selectedCategory === 'RESTAURANT'
              ? 'bg-[#FFF1F2] text-[#E11D48] border-rose-300 font-bold shadow-xs'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
          <span>Quán ăn</span>
        </button>

        {/* Chip: Cà phê */}
        <button
          onClick={() => onCategoryChange(selectedCategory === 'CAFE' ? 'ALL' : 'CAFE')}
          className={`h-7 px-3 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition shrink-0 backdrop-blur-sm ${
            selectedCategory === 'CAFE'
              ? 'bg-[#FEF3C7] text-[#8A5B3D] border-amber-300 font-bold shadow-xs'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#8A5B3D]" />
          <span>Cà phê</span>
        </button>

        {/* Chip: Ăn vặt */}
        <button
          onClick={() => onCategoryChange(selectedCategory === 'STREET_FOOD' ? 'ALL' : 'STREET_FOOD')}
          className={`h-7 px-3 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 transition shrink-0 backdrop-blur-sm ${
            selectedCategory === 'STREET_FOOD'
              ? 'bg-[#FEF9C3] text-[#B45309] border-yellow-300 font-bold shadow-xs'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
          <span>Ăn vặt</span>
        </button>

        {/* Chip: Giá < 50k */}
        <button
          onClick={onMaxPriceToggle}
          className={`h-7 px-3 rounded-full text-[11px] font-semibold border flex items-center gap-1 transition shrink-0 backdrop-blur-sm ${
            maxPrice
              ? 'bg-rose-50 text-rose-600 border-rose-300 font-bold shadow-xs'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <span>💰</span>
          <span>{maxPrice ? '< 50.000đ' : 'Giá < 50k'}</span>
        </button>

        {/* Chip: Đánh giá >= 4.7 sao */}
        <button
          onClick={onMinRatingToggle}
          className={`h-7 px-3 rounded-full text-[11px] font-semibold border flex items-center gap-1 transition shrink-0 backdrop-blur-sm ${
            minRating
              ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold shadow-xs'
              : 'bg-white/90 text-slate-600 border-slate-200 hover:bg-white'
          }`}
        >
          <span>⭐</span>
          <span>{minRating ? '≥ 4.7★' : 'Đánh giá cao'}</span>
        </button>
      </div>
    </div>
  );
};

