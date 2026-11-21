import { User } from './user.types';

export type NotificationType = 'YUMMY' | 'COMMENT' | 'REPLY' | 'FOLLOW';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  sender: Pick<User, '_id' | 'username' | 'fullName' | 'avatarUrl'>;
  post: { _id: string; title: string } | null;
  isRead: boolean;
  createdAt: string;
}
