import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

const STORAGE_KEY = 'hust_food_theme';

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
  } catch {
    // LocalStorage unavailable
  }
  return 'light';
};

const resolveIsDark = (theme: ThemeMode): boolean => {
  if (typeof window === 'undefined') return false;
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyThemeToDOM = (isDark: boolean) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  isDark: resolveIsDark(getInitialTheme()),

  toggleTheme: () => {
    const currentIsDark = get().isDark;
    const nextTheme: ThemeMode = currentIsDark ? 'light' : 'dark';
    const nextIsDark = !currentIsDark;

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // LocalStorage error
    }

    applyThemeToDOM(nextIsDark);
    set({ theme: nextTheme, isDark: nextIsDark });
  },

  setTheme: (theme: ThemeMode) => {
    const nextIsDark = resolveIsDark(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // LocalStorage error
    }

    applyThemeToDOM(nextIsDark);
    set({ theme, isDark: nextIsDark });
  },

  initTheme: () => {
    const currentTheme = get().theme;
    const isDark = resolveIsDark(currentTheme);
    applyThemeToDOM(isDark);
    set({ isDark });

    // Listen for system theme changes if set to system
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (get().theme === 'system') {
          const newIsDark = mediaQuery.matches;
          applyThemeToDOM(newIsDark);
          set({ isDark: newIsDark });
        }
      };

      mediaQuery.addEventListener('change', handleChange);
    }
  },
}));
