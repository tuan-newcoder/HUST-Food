export type PlaceCategory = 'RESTAURANT' | 'CAFE' | 'STREET_FOOD' | 'BAKERY' | 'OTHER';

export interface PriceRange {
  min: number;
  max: number;
}

export interface OpeningHours {
  open: string;
  close: string;
}

export interface MenuItem {
  name: string;
  price: number;
  imageUrl?: string;
}

export interface PlaceLocation {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface PlaceRatings {
  taste: number;
  price: number;
  hygiene: number;
  service: number;
  overall: number;
}

export interface Place {
  _id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  coverImage: string;
  images?: string[];
  priceRange: PriceRange;
  openingHours?: OpeningHours;
  menu?: MenuItem[];
  location?: PlaceLocation;
  averageRatings?: PlaceRatings;
  totalReviews?: number;
  bookmarksCount?: number;
  isBookmarked?: boolean;
  distanceMeters?: number;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
}

