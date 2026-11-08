import { User } from './user.types';

export interface Comment {
  _id: string;
  postId: string;
  parentId?: string | null;
  content: string;
  author: Pick<User, '_id' | 'username' | 'fullName' | 'avatarUrl'>;
  repliesCount: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt?: string;
}

