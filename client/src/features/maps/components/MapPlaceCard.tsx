import React from 'react';
import { MapPlace } from '../types';

interface MapPlaceCardProps {
  place: MapPlace;
  onClose: () => void;
  onNavigateDetail?: (placeId: string) => void;
}

export const MapPlaceCard: React.FC<MapPlaceCardProps> = ({
  place,
  onClose,
  onNavigateDetail = () => {},
}) => {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'RESTAURANT': return 'Quán ăn';
      case 'CAFE': return 'Cà phê';
      case 'STREET_FOOD': return 'Ăn vặt';
      default: return 'Ẩm thực';
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'RESTAURANT': return 'bg-[#FFF1F2] text-[#E11D48] border-rose-200';
      case 'CAFE': return 'bg-[#FEF3C7] text-[#8A5B3D] border-amber-200';
      case 'STREET_FOOD': return 'bg-[#FEF9C3] text-[#B45309] border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatPrice = (price: number) => {
    return (price / 1000).toLocaleString('vi-VN') + 'k';
  };

  return (
    <div className="absolute bottom-20 left-6 z-[600] w-[370px] bg-white rounded-2xl shadow-[0_12px_32px_rgba(15,23,42,0.14)] border border-slate-200/90 p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 pointer-events-auto select-none">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition z-10"
        title="Đóng"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main place card body */}
      <div className="flex gap-3.5 items-start">
        {/* Thumbnail */}
        <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-xs">
          <img
            src={place.coverImage}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs">
            Mở cửa
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeColor(place.category)}`}>
              {getCategoryLabel(place.category)}
            </span>
            {place.distanceMeters && (
              <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-0.5">
                📍 {place.distanceMeters}m
              </span>
            )}
          </div>

          <h4 className="font-bold text-sm text-[#0F172A] leading-snug line-clamp-2 mb-1">
            {place.name}
          </h4>

          <p className="text-[11px] text-[#64748B] line-clamp-1 mb-1.5">
            {place.address}
          </p>

          {/* Rating and Price row */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 font-bold text-amber-500">
              <span>⭐</span>
              <span>{place.averageRatings.overall}</span>
              <span className="text-[10px] font-normal text-slate-400">
                ({place.totalReviews})
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-700 text-[11px]">
              {formatPrice(place.priceRange.min)} - {formatPrice(place.priceRange.max)}
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => onNavigateDetail(place._id)}
          className="flex-1 h-9 rounded-xl bg-[#E11D48] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-rose-700 active:scale-[0.98] transition shadow-md shadow-rose-500/20"
        >
          <span>Xem chi tiết & Menu</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <button
          onClick={() => alert(`Đã ${place.isBookmarked ? 'bỏ lưu' : 'lưu'} quán ${place.name} vào Bookmarks`)}
          className={`h-9 w-9 rounded-xl border flex items-center justify-center transition ${
            place.isBookmarked
              ? 'bg-amber-50 border-amber-300 text-amber-500'
              : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={place.isBookmarked ? 'Đã lưu' : 'Lưu quán'}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill={place.isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

