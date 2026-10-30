import { create } from 'zustand';
import { User } from '@/types/user.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const STORAGE_KEYS = {
  USER: 'hust_food_user',
  ACCESS_TOKEN: 'hust_food_access_token',
  REFRESH_TOKEN: 'hust_food_refresh_token',
};

// Khôi phục dữ liệu ban đầu từ localStorage (nếu có)
const initialUser = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
const initialRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: initialAccessToken,
  refreshToken: initialRefreshToken,
  isAuthenticated: !!(initialUser && initialAccessToken),
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

