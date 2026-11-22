import React from 'react';
import { MapTileLayerType } from '../types';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  currentLayer: MapTileLayerType;
  onChangeLayer: (layer: MapTileLayerType) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  currentLayer,
  onChangeLayer,
}) => {
  const nextLayer = (): MapTileLayerType => {
    if (currentLayer === 'streets') return 'warm';
    if (currentLayer === 'warm') return 'satellite';
    return 'streets';
  };

  const getLayerName = (layer: MapTileLayerType) => {
    switch (layer) {
      case 'satellite': return 'Vệ tinh';
      case 'warm': return 'Bản đồ ấm';
      default: return 'Chuẩn';
    }
  };

  const hasMapbox = Boolean(import.meta.env.VITE_MAPBOX_API_KEY?.trim()?.startsWith('pk.'));

  return (
    <>
      {/* 1. North Compass Indicator (Matching SVG at x=1388 y=194) */}
      <div className="absolute top-6 right-6 z-[500] flex flex-col items-center gap-1 pointer-events-auto select-none">
        <span className="text-[11px] font-bold tracking-wider text-[#64748B]">N</span>
        <button
          onClick={onRecenter}
          title="Hướng Bắc (Click để quay về tâm HUST)"
          className="w-[34px] h-[34px] rounded-full bg-white/90 backdrop-blur-sm shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-slate-200/80 flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition"
        >
          {/* Compass needle from SVG */}
          <svg className="w-4 h-4 text-[#E11D48]" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5L12 14.5L8 12L4 14.5L8 1.5Z"
              stroke="#E11D48"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#E11D48"
              fillOpacity="0.1"
            />
          </svg>
        </button>
      </div>

      {/* 2. Floating Action Group (Matching SVG at x=1368, y=724, 782, 840, 898) */}
      <div className="absolute bottom-20 right-6 z-[500] flex flex-col gap-3 pointer-events-auto select-none">
        {/* GPS Recenter Button (Crosshair Target in #3282F6) */}
        <button
          onClick={onRecenter}
          title="Định vị vị trí của tôi (Đại học Bách Khoa Hà Nội)"
          className="w-12 h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#DCE9FE] flex items-center justify-center hover:bg-blue-50/80 active:scale-95 transition group"
        >
          <svg className="w-5 h-5 text-[#3282F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <line x1="12" y1="2" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="2" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="22" y2="12" />
          </svg>
        </button>

        {/* Zoom In Button (+) */}
        <button
          onClick={onZoomIn}
          title="Phóng to bản đồ (+)"
          className="w-12 h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E9ECE7] flex items-center justify-center hover:bg-slate-50 active:scale-95 transition text-[#172332]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Zoom Out Button (-) */}
        <button
          onClick={onZoomOut}
          title="Thu nhỏ bản đồ (-)"
          className="w-12 h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E9ECE7] flex items-center justify-center hover:bg-slate-50 active:scale-95 transition text-[#172332]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        {/* Map Layer Switcher Button */}
        <button
          onClick={() => onChangeLayer(nextLayer())}
          title={`Đổi kiểu hiển thị bản đồ (Hiện tại: ${getLayerName(currentLayer)})`}
          className="w-12 h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-[#E9ECE7] flex items-center justify-center hover:bg-slate-50 active:scale-95 transition text-[#172332] relative group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          {/* Tooltip hint */}
          <span className="absolute right-14 whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
            Kiểu: {getLayerName(currentLayer)}
          </span>
        </button>
      </div>

      {/* 3. Scale Bar (Matching SVG at x=1238, y=958: "200 m") */}
      <div className="absolute bottom-6 right-6 z-[500] flex flex-col items-end pointer-events-none select-none">
        <span className="text-[11px] font-medium text-[#6A756B] mb-0.5">200 m</span>
        <div className="w-[92px] h-[6px] border-b-2 border-l-2 border-r-2 border-[#879084]" />
      </div>

      {/* 4. Attribution Watermark (Matching SVG at x=1153, y=1001) */}
      <div className="absolute bottom-1 right-2 z-[500] px-2 py-0.5 rounded bg-white/75 backdrop-blur-xs text-[10px] text-[#547C9C] pointer-events-none select-none flex items-center gap-1">
        <span>Leaflet</span>
        <span>|</span>
        <span>{hasMapbox ? '© Mapbox' : '© OpenStreetMap contributors'}</span>
      </div>
    </>
  );
};

