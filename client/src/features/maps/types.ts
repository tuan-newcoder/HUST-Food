export type PlaceCategory = 'RESTAURANT' | 'CAFE' | 'STREET_FOOD' | 'BAKERY' | 'OTHER';

export interface MapPlace {
  _id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  coverImage: string;
  priceRange: {
    min: number;
    max: number;
  };
  openingHours: {
    open: string;
    close: string;
  };
  averageRatings: {
    taste: number;
    price: number;
    hygiene: number;
    service: number;
    overall: number;
  };
  totalReviews: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  distanceMeters?: number;
  isBookmarked?: boolean;
}

export type MapTileLayerType = 'streets' | 'satellite' | 'warm';

export interface MapFilterState {
  radiusMeters: number; // 500, 1000, 2000, 5000
  category: 'ALL' | PlaceCategory;
  maxPrice?: number;
  minRating?: number;
  searchQuery: string;
}

