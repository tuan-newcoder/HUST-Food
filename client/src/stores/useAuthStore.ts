import { create } from 'zustand';
import { User } from '@/types/user.types';

export const DEMO_USER: User = {
  _id: 'usr_hust_01',
  username: 'tuan_le',
  fullName: 'Lê Anh Tuấn',
  email: 'tuan.la@sis.hust.edu.vn',
  avatarUrl:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
  bio: 'Sinh viên K66 Bách Khoa • Đam mê săn lùng quán ngon Tạ Quang Bửu, bún cá cay và cà phê học bài 🍜☕',
  role: 'USER',
  status: 'ACTIVE',
  followersCount: 142,
  followingCount: 38,
  postsCount: 12,
  createdAt: '2026-10-15T08:00:00Z',
};

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (data: Partial<User>) => void;
  loginDemoUser: () => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const STORAGE_KEYS = {
  USER: 'hust_food_user',
  ACCESS_TOKEN: 'hust_food_access_token',
  REFRESH_TOKEN: 'hust_food_refresh_token',
};

// Khôi phục dữ liệu ban đầu từ localStorage (nếu có)
const getInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    const user = raw ? JSON.parse(raw) : DEMO_USER; // Mặc định cung cấp demo user để thuận tiện phát triển
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || 'demo_access_token';
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || 'demo_refresh_token';
    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!user,
    };
  } catch {
    return {
      user: DEMO_USER,
      accessToken: 'demo_access_token',
      refreshToken: 'demo_refresh_token',
      isAuthenticated: true,
    };
  }
};

const initial = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initial.user,
  accessToken: initial.accessToken,
  refreshToken: initial.refreshToken,
  isAuthenticated: initial.isAuthenticated,
  isLoading: false,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    set({ accessToken });
  },

  updateUser: (data) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return { user: updatedUser };
    });
  },

  loginDemoUser: () => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'demo_access_token');
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'demo_refresh_token');
    set({
      user: DEMO_USER,
      accessToken: 'demo_access_token',
      refreshToken: 'demo_refresh_token',
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
