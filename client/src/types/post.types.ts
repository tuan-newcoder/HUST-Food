import { User } from './user.types';

export type PostType = 'EXPERIENCE' | 'RECIPE';
export type RecipeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Ingredient {
  name: string;
  amount: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  imageUrl?: string;
}

export interface RecipeInfo {
  cookingTimeMinutes: number;
  estimatedCost: number;
  servings: number;
  difficulty: RecipeDifficulty;
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

export interface PostMetrics {
  yummyCount: number;
  commentsCount: number;
  savesCount: number;
}

export interface PlaceSnippet {
  _id: string;
  name: string;
  address: string;
  coverImage?: string;
  averageRatings?: {
    taste: number;
    price: number;
    hygiene: number;
    service: number;
    overall: number;
  };
}

export interface Post {
  _id: string;
  authorId: string;
  author: Pick<User, '_id' | 'username' | 'fullName' | 'avatarUrl'>;
  postType: PostType;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  placeId?: string | null;
  place?: PlaceSnippet | null;
  recipeInfo?: RecipeInfo;
  metrics: PostMetrics;
  status: 'PUBLISHED' | 'HIDDEN';
  isYummied?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TrendingTag {
  tag: string;
  postsCount: number;
}

