export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'BANNED';

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

