import React, { useState, useMemo } from 'react';
import { MapCanvas } from '../components/MapCanvas';
import { MapFloatingTopBar } from '../components/MapFloatingTopBar';
import { MapLegend } from '../components/MapLegend';
import { MapControls } from '../components/MapControls';
import { MapPlaceCard } from '../components/MapPlaceCard';
import { HUST_COORDINATES, MOCK_MAP_PLACES } from '../mockPlaces';
import { MapPlace, MapTileLayerType, PlaceCategory } from '../types';

interface FoodMapViewProps {
  onNavigatePlaceDetail?: (placeId: string) => void;
}

export const FoodMapView: React.FC<FoodMapViewProps> = ({
  onNavigatePlaceDetail = () => {},
}) => {
  // Map settings state
  const [userLocation] = useState<[number, number]>(HUST_COORDINATES);
  const [tileLayer, setTileLayer] = useState<MapTileLayerType>('warm');
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(MOCK_MAP_PLACES[0]);

  // Viewport action triggers
  const [triggerRecenter, setTriggerRecenter] = useState(0);
  const [triggerZoomIn, setTriggerZoomIn] = useState(0);
  const [triggerZoomOut, setTriggerZoomOut] = useState(0);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusMeters, setRadiusMeters] = useState(1000); // 1km by default
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | PlaceCategory>('ALL');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return MOCK_MAP_PLACES.filter((place) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = place.name.toLowerCase().includes(q);
        const matchAddress = place.address.toLowerCase().includes(q);
        if (!matchName && !matchAddress) return false;
      }

      // 2. Category
      if (selectedCategory !== 'ALL' && place.category !== selectedCategory) {
        return false;
      }

      // 3. Max Price (< 50k)
      if (maxPrice && place.priceRange.min > maxPrice) {
        return false;
      }

      // 4. Min Rating (>= 4.7)
      if (minRating && place.averageRatings.overall < minRating) {
        return false;
      }

      // 5. Radius Filter
      if (place.distanceMeters && place.distanceMeters > radiusMeters) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, maxPrice, minRating, radiusMeters]);

  return (
    <div className="relative w-full h-[calc(100vh-82px)] overflow-hidden bg-slate-100 select-none">
      {/* 1. Real Leaflet OpenStreetMap Canvas */}
      <MapCanvas
        center={HUST_COORDINATES}
        userLocation={userLocation}
        places={filteredPlaces}
        selectedPlace={selectedPlace}
        onSelectPlace={(place) => setSelectedPlace(place)}
        radiusMeters={radiusMeters}
        tileLayer={tileLayer}
        zoomLevel={16}
        triggerRecenter={triggerRecenter}
        triggerZoomIn={triggerZoomIn}
        triggerZoomOut={triggerZoomOut}
      />

      {/* 2. Top Floating Filter & Search Bar */}
      <MapFloatingTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        radiusMeters={radiusMeters}
        onRadiusChange={(r) => {
          setRadiusMeters(r);
          // If selected place is outside new radius, deselect it
          if (selectedPlace?.distanceMeters && selectedPlace.distanceMeters > r) {
            setSelectedPlace(null);
          }
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        maxPrice={maxPrice}
        onMaxPriceToggle={() => setMaxPrice((prev) => (prev ? undefined : 50000))}
        minRating={minRating}
        onMinRatingToggle={() => setMinRating((prev) => (prev ? undefined : 4.7))}
      />

      {/* 3. Bottom Center Legend Pill (Exact Match with Figma SVG at x=440, y=945) */}
      <MapLegend
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 4. Right Tool Controls & Compass (Exact Match with Figma SVG) */}
      <MapControls
        onZoomIn={() => setTriggerZoomIn((prev) => prev + 1)}
        onZoomOut={() => setTriggerZoomOut((prev) => prev + 1)}
        onRecenter={() => {
          setTriggerRecenter((prev) => prev + 1);
          setSelectedPlace(null);
        }}
        currentLayer={tileLayer}
        onChangeLayer={setTileLayer}
      />

      {/* 5. Selected Place Details Card (Bottom-Left popup) */}
      {selectedPlace && (
        <MapPlaceCard
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onNavigateDetail={onNavigatePlaceDetail}
        />
      )}

      {/* 6. Empty state pill if no places match filter */}
      {filteredPlaces.length === 0 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[500] px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold shadow-lg flex items-center gap-2">
          <span>🔍</span>
          <span>Không tìm thấy quán ăn nào trong bán kính {radiusMeters}m. Hãy thử tăng bán kính!</span>
        </div>
      )}
    </div>
  );
};

