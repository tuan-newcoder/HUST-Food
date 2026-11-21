import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPlace, MapTileLayerType } from '../types';

interface MapCanvasProps {
  center: [number, number]; // [lat, lng]
  userLocation: [number, number];
  places: MapPlace[];
  selectedPlace: MapPlace | null;
  onSelectPlace: (place: MapPlace) => void;
  radiusMeters: number;
  tileLayer: MapTileLayerType;
  zoomLevel: number;
  onZoomChange?: (zoom: number) => void;
  triggerRecenter: number;
  triggerZoomIn: number;
  triggerZoomOut: number;
}

// Controller component to fix Leaflet 0x0 container size on mount/resize
const MapResizeHandler: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Invalidate immediately, then at 150ms and 500ms to guarantee tiles load when layout settles
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
};

// Controller component to control Leaflet viewport from external React buttons
const MapViewportController: React.FC<{
  center: [number, number];
  selectedPlace: MapPlace | null;
  triggerRecenter: number;
  triggerZoomIn: number;
  triggerZoomOut: number;
}> = ({ center, selectedPlace, triggerRecenter, triggerZoomIn, triggerZoomOut }) => {
  const map = useMap();

  // Recenter to user / HUST center
  useEffect(() => {
    if (triggerRecenter > 0) {
      map.flyTo(center, 16, { duration: 1.2 });
    }
  }, [triggerRecenter, center, map]);

  // Zoom in
  useEffect(() => {
    if (triggerZoomIn > 0) {
      map.zoomIn();
    }
  }, [triggerZoomIn, map]);

  // Zoom out
  useEffect(() => {
    if (triggerZoomOut > 0) {
      map.zoomOut();
    }
  }, [triggerZoomOut, map]);

  // Pan to place when selected
  useEffect(() => {
    if (selectedPlace) {
      const [lng, lat] = selectedPlace.location.coordinates;
      map.flyTo([lat, lng], 17, { duration: 0.8 });
    }
  }, [selectedPlace, map]);

  return null;
};

// Generate Leaflet divIcon for custom category pin
const createCustomPinIcon = (place: MapPlace, isSelected: boolean) => {
  let pinColor = '#E11D48'; // Red for restaurant
  let iconSvg = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
      <line x1="6" y1="1" x2="6" y2="4"></line>
      <line x1="10" y1="1" x2="10" y2="4"></line>
      <line x1="14" y1="1" x2="14" y2="4"></line>
    </svg>
  `;

  if (place.category === 'CAFE') {
    pinColor = '#8A5B3D'; // Brown
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
        <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
        <line x1="6" y1="2" x2="6" y2="4"></line>
        <line x1="10" y1="2" x2="10" y2="4"></line>
        <line x1="14" y1="2" x2="14" y2="4"></line>
      </svg>
    `;
  } else if (place.category === 'STREET_FOOD') {
    pinColor = '#F59E0B'; // Amber
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8v12h16V10a8 8 0 0 0-8-8z"></path>
        <path d="M4 14h16"></path>
      </svg>
    `;
  }

  const activeStyles = isSelected
    ? 'scale-125 z-50 ring-4 ring-white shadow-2xl animate-bounce'
    : 'hover:scale-110 shadow-md';

  const html = `
    <div style="position: relative; width: 36px; height: 44px; display: flex; align-items: center; justify-content: center;">
      <!-- Teardrop Pin Marker -->
      <div class="${activeStyles}" style="
        width: 36px;
        height: 36px;
        background: ${pinColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        transition: all 0.2s ease;
      ">
        <!-- Inner Icon Rotated Back -->
        <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">
          ${iconSvg}
        </div>
      </div>
      <!-- Pin Anchor Dot at Bottom -->
      <div style="
        position: absolute;
        bottom: 2px;
        width: 6px;
        height: 6px;
        background: rgba(15,23,42,0.35);
        border-radius: 50%;
        filter: blur(1px);
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-pin',
    iconSize: [36, 44],
    iconAnchor: [18, 42],
  });
};

// User Location Pulsing Beacon Icon
const userBeaconIcon = L.divIcon({
  html: '<div class="user-beacon"></div>',
  className: 'user-beacon-wrapper',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const MapCanvas: React.FC<MapCanvasProps> = ({
  center,
  userLocation,
  places,
  selectedPlace,
  onSelectPlace,
  radiusMeters,
  tileLayer,
  zoomLevel,
  triggerRecenter,
  triggerZoomIn,
  triggerZoomOut,
}) => {
  // Read Mapbox API Token from Vite environment
  const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY?.trim();
  const hasMapbox = Boolean(mapboxToken && mapboxToken.startsWith('pk.'));

  // Tile URLs according to currentLayer state & token availability
  const getTileConfig = (type: MapTileLayerType) => {
    if (hasMapbox) {
      switch (type) {
        case 'satellite':
          return {
            url: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
            attribution: '© Mapbox © OpenStreetMap',
          };
        case 'warm':
          return {
            url: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
            attribution: '© Mapbox © OpenStreetMap',
          };
        default:
          return {
            url: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}?access_token=${mapboxToken}`,
            attribution: '© Mapbox © OpenStreetMap',
          };
      }
    }

    // High quality free fallbacks (no API key required)
    switch (type) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Esri, Maxar, Earthstar Geographics',
        };
      case 'warm':
        return {
          url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          attribution: '© CARTO, © OpenStreetMap contributors',
        };
      default:
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '© OpenStreetMap contributors',
        };
    }
  };

  const tileConfig = getTileConfig(tileLayer);

  return (
    <div className="w-full h-full min-h-[500px] relative select-none">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      >
        {/* Resize Handler to prevent 0x0 size collapse on load */}
        <MapResizeHandler />

        {/* Dynamic Tile Layer with forced re-render on layer change */}
        <TileLayer
          key={`${tileLayer}-${hasMapbox ? 'mapbox' : 'osm'}`}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={19}
        />

        {/* Viewport Controller Hook */}
        <MapViewportController
          center={center}
          selectedPlace={selectedPlace}
          triggerRecenter={triggerRecenter}
          triggerZoomIn={triggerZoomIn}
          triggerZoomOut={triggerZoomOut}
        />

        {/* User Location Pulsing Beacon Marker */}
        <Marker position={userLocation} icon={userBeaconIcon} />

        {/* Semi-transparent scan radius circle around user/center */}
        <Circle
          center={userLocation}
          radius={radiusMeters}
          pathOptions={{
            color: '#F59E0B',
            weight: 1.8,
            dashArray: '6, 6',
            fillColor: '#F59E0B',
            fillOpacity: 0.08,
          }}
        />

        {/* Place Markers */}
        {places.map((place) => {
          const [lng, lat] = place.location.coordinates;
          const isSelected = selectedPlace?._id === place._id;
          const pinIcon = createCustomPinIcon(place, isSelected);

          return (
            <Marker
              key={place._id}
              position={[lat, lng]}
              icon={pinIcon}
              eventHandlers={{
                click: () => onSelectPlace(place),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};
