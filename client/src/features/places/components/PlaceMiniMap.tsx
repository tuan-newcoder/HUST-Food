import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#E11D48;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.25)"></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

const TILE_URL = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '© CARTO, © OpenStreetMap contributors';

/** Đồng bộ tâm bản đồ khi vị trí thay đổi & sửa lỗi kích thước 0x0 khi mount */
const Recenter: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

const ClickToPick: React.FC<{ onPick: (pos: [number, number]) => void }> = ({ onPick }) => {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) });
  return null;
};

interface PlaceMiniMapProps {
  /** [lat, lng] */
  position: [number, number];
  className?: string;
  zoom?: number;
  /** Bật chế độ chọn vị trí: click hoặc kéo ghim để đổi tọa độ */
  onChange?: (pos: [number, number]) => void;
}

export const PlaceMiniMap: React.FC<PlaceMiniMapProps> = ({ position, className, zoom = 17, onChange }) => (
  <MapContainer
    center={position}
    zoom={zoom}
    scrollWheelZoom={!!onChange}
    dragging
    zoomControl={!!onChange}
    attributionControl={false}
    className={className}
  >
    <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
    <Recenter position={position} />
    {onChange && <ClickToPick onPick={onChange} />}
    <Marker
      position={position}
      icon={pinIcon}
      draggable={!!onChange}
      eventHandlers={
        onChange
          ? {
              dragend: (e) => {
                const ll = (e.target as L.Marker).getLatLng();
                onChange([ll.lat, ll.lng]);
              },
            }
          : undefined
      }
    />
  </MapContainer>
);
