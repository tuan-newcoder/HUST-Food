import React from 'react';
import { PlaceCategory } from '../types';

interface MapLegendProps {
  selectedCategory: 'ALL' | PlaceCategory;
  onSelectCategory: (category: 'ALL' | PlaceCategory) => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] pointer-events-auto">
      {/* Pill matching SVG at (440, 945) w=233 h=42 rx=21 */}
      <div className="h-[42px] px-5 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(36,49,40,0.08)] border border-slate-200/80 flex items-center gap-5 select-none transition-all">
        {/* Category 1: Quán ăn */}
        <button
          onClick={() => onSelectCategory(selectedCategory === 'RESTAURANT' ? 'ALL' : 'RESTAURANT')}
          className={`flex items-center gap-2 text-xs font-semibold transition ${
            selectedCategory === 'RESTAURANT'
              ? 'text-[#E11D48] scale-105'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          title="Lọc Quán ăn"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] ring-2 ring-rose-200" />
          <span>Quán ăn</span>
        </button>

        {/* Divider */}
        <span className="w-[1px] h-3.5 bg-slate-200" />

        {/* Category 2: Cà phê */}
        <button
          onClick={() => onSelectCategory(selectedCategory === 'CAFE' ? 'ALL' : 'CAFE')}
          className={`flex items-center gap-2 text-xs font-semibold transition ${
            selectedCategory === 'CAFE'
              ? 'text-[#8A5B3D] scale-105'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          title="Lọc Quán Cà phê"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#8A5B3D] ring-2 ring-amber-900/20" />
          <span>Cà phê</span>
        </button>

        {/* Divider */}
        <span className="w-[1px] h-3.5 bg-slate-200" />

        {/* Category 3: Ăn vặt */}
        <button
          onClick={() => onSelectCategory(selectedCategory === 'STREET_FOOD' ? 'ALL' : 'STREET_FOOD')}
          className={`flex items-center gap-2 text-xs font-semibold transition ${
            selectedCategory === 'STREET_FOOD'
              ? 'text-[#F59E0B] scale-105'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
          title="Lọc Quán Ăn vặt"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-amber-200" />
          <span>Ăn vặt</span>
        </button>
      </div>
    </div>
  );
};

