import { User } from './user.types';

export interface ReviewRatingsInput {
  taste: number;
  price: number;
  hygiene: number;
  service: number;
}

export interface ReviewRatings extends ReviewRatingsInput {
  overall: number;
}

export interface Review {
  _id: string;
  placeId: string;
  ratings: ReviewRatings;
  content: string;
  images: string[];
  author: Pick<User, '_id' | 'username' | 'fullName' | 'avatarUrl'>;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewPayload {
  ratings: ReviewRatingsInput;
  content: string;
  images?: string[];
}
